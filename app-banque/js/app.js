/* Application bancaire mobile – rendu des écrans et navigation (routeur par hash). */
(function () {
  'use strict';

  const D = window.BANK_DATA;
  const I = window.ICONS;
  const app = document.getElementById('app');

  /* ---------------- État persistant ---------------- */
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('kairos.' + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try { localStorage.setItem('kairos.' + key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ }
    },
  };

  const state = {
    hideBalance: store.get('hideBalance', false),
    categories: store.get('categories', {}),
    cardFrozen: store.get('cardFrozen', false),
    filter: 'all',
    homeScroll: 0,
    current: null,
  };

  /* ---------------- Données dérivées ---------------- */
  const txs = D.transactions.slice().sort((a, b) => b.date.localeCompare(a.date));
  let running = D.account.balance;
  txs.forEach((t) => {
    t.balanceAfter = running;
    running -= t.amount;
  });
  const txById = Object.fromEntries(txs.map((t) => [t.id, t]));

  /* ---------------- Formatage ---------------- */
  const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  const MONTHS_LONG = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const pad2 = (n) => String(n).padStart(2, '0');

  const groupDigits = (n) => String(Math.abs(Math.round(n))).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const money = (n, signed) => (signed ? (n < 0 ? '-' : '+') : '') + groupDigits(n) + ' F';

  function parseDate(s) {
    const [d, t = '00:00'] = s.split('T');
    const [y, m, day] = d.split('-').map(Number);
    const [hh, mm] = t.split(':').map(Number);
    return new Date(y, m - 1, day, hh, mm);
  }
  const time = (d) => pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  const shortDate = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]} - ${time(d)}`;
  const fullDate = (d) => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${time(d)}`;
  const dayTitle = (d) => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function formatPhone(p) {
    // +2250700000001 -> +225 07 00 00 00 01
    const m = /^\+225(\d{10})$/.exec(p || '');
    if (!m) return p || '';
    return '+225 ' + m[1].replace(/(\d{2})(?=\d)/g, '$1 ');
  }

  const STATUS = {
    done: { label: 'Effectué', cls: 'ok' },
    pending: { label: 'En cours', cls: 'pending' },
    failed: { label: 'Échoué', cls: 'failed' },
  };

  function txIcon(t) {
    switch (t.type) {
      case 'mobile_transfer': return I.txMobile;
      case 'cash_deposit': return I.txDeposit;
      case 'subscription': return I.txCrown;
      case 'bill': return I.txBill;
      case 'account_transfer_in': return I.txIncoming;
      case 'card_topup': return I.txCard;
      default: return t.amount >= 0 ? I.txIncoming : I.txMobile;
    }
  }

  function txDescription(t) {
    const done = t.status === 'done';
    const name = esc(t.counterparty);
    switch (t.type) {
      case 'mobile_transfer':
        return `Le transfert ${esc(t.operator || 'Mobile Money')} à ${name} (${esc(t.phone)}) à partir de votre compte ${esc(D.bankName)} ${done ? 'a été effectué' : 'est en cours'}.`;
      case 'cash_deposit':
        return `Dépôt d'espèces auprès de l'agent ${name}. Les fonds sont disponibles sur votre compte courant.`;
      case 'subscription':
        return `Prélèvement mensuel de votre abonnement ${name}.`;
      case 'bill':
        return `Paiement de la facture ${name} depuis votre compte courant.`;
      case 'account_transfer_in':
        return `Virement reçu de ${name} sur votre compte courant.`;
      case 'card_topup':
        return `Rechargement de votre carte ${esc(D.bankName)} depuis votre compte courant.`;
      default:
        return '';
    }
  }

  /* ---------------- QR code ---------------- */
  function qrSvg(text) {
    if (typeof window.qrcode !== 'function') return '';
    const qr = window.qrcode(0, 'H');
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
      }
    }
    return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="QR code de paiement"><path d="${d}" fill="#111"/></svg>`;
  }
  const qrPayload = `https://kairos.example/payer?compte=${encodeURIComponent(D.account.number.replace(/\s/g, ''))}`;
  let qrCache = null;
  const qrMarkup = () => (qrCache = qrCache || qrSvg(qrPayload));

  /* ---------------- Composants ---------------- */
  const avatar = () =>
    D.user.avatar ? `<img src="${esc(D.user.avatar)}" alt="${esc(D.user.name)}">` : I.avatar;

  const topbar = () => `
    <header class="topbar">
      <button class="avatar" data-action="profile" aria-label="Profil">${avatar()}</button>
      <button class="help" data-action="help">${I.headset}<span>Besoin d'aide ?</span></button>
    </header>`;

  function txRow(t) {
    const incoming = t.amount > 0;
    const statusCls = t.status !== 'done' ? ` tx-status-${t.status}` : '';
    return `
      <a class="tx" href="#operation-${encodeURIComponent(t.id)}">
        <span class="tx-icon">${txIcon(t)}</span>
        <span class="tx-name">${esc(t.label)}</span>
        <span class="tx-amount${incoming ? ' in' : ''}">${money(t.amount, true)}</span>
        <span class="tx-date${statusCls}">${shortDate(parseDate(t.date))}</span>
        <span class="tx-chev">${I.chevronRight}</span>
      </a>`;
  }

  const NAV = [
    { key: 'comptes', label: 'Comptes', href: '#comptes', icon: I.bank },
    { key: 'epargne', label: 'Épargne', href: '#epargne', icon: I.safe },
    { key: 'investir', label: 'Investir', href: '#investir', icon: I.invest },
    { key: 'credit', label: 'Crédit', href: '#credit', icon: I.credit },
  ];
  const bottomNav = (active) => `
    <nav class="bottom-nav">
      ${NAV.map((n) => `
        <a class="nav-item${n.key === active ? ' active' : ''}" href="${n.href}" ${n.key === active ? 'aria-current="page"' : ''}>
          <span class="nav-icon">${n.icon}</span><span>${n.label}</span>
        </a>`).join('')}
    </nav>`;

  const appbar = (title, right = '') => `
    <header class="appbar">
      <button class="icon-btn" data-action="back" aria-label="Retour">${I.arrowLeft}</button>
      <h1>${esc(title)}</h1>
      ${right}
    </header>`;

  /* ---------------- Écrans ---------------- */
  function homeScreen() {
    const hidden = state.hideBalance;
    const quick = [
      { label: 'Transfert', icon: I.transfer },
      { label: 'Factures', icon: I.bills },
      { label: 'N° de compte', icon: I.accountNumber, action: 'account-number' },
      { label: 'Budget', icon: I.budget },
      { label: 'Business', icon: I.business },
    ];
    return `
      <div class="screen home">
        <div class="scroll">
          ${topbar()}
          <div class="hero">
            <section class="balance-card">
              <div class="bc-left">
                <div class="bc-label">
                  ${esc(D.account.label)}
                  <button data-action="toggle-balance" aria-label="${hidden ? 'Afficher le solde' : 'Masquer le solde'}">${hidden ? I.eye : I.eyeOff}</button>
                </div>
                <div class="bc-amount${hidden ? ' masked' : ''}">${hidden ? '•••••• F' : money(D.account.balance)}</div>
                <button class="btn-primary" data-action="deposit">${I.plus}<span>Déposer de l'argent</span></button>
              </div>
              <button class="qr" data-action="qr" aria-label="Afficher mon QR code">
                <span class="qr-inner">${qrMarkup()}<span class="qr-logo">k</span></span>
              </button>
            </section>
          </div>

          <a class="tile" href="#carte">
            <div>
              <div class="tile-label">${I.cardPouch}<span>${esc(D.card.label)}</span></div>
              <div class="tile-amount">${hidden ? '••• F' : money(D.card.balance)}</div>
            </div>
            <span class="tile-chev">${I.chevronRight}</span>
          </a>

          <nav class="quick">
            ${quick.map((q) => `
              <button class="qa" data-action="${q.action || 'soon'}" data-label="${esc(q.label)}">
                <span class="qa-circle">${q.icon}</span>
                <span class="qa-label">${esc(q.label)}</span>
              </button>`).join('')}
          </nav>

          <section class="tx-list">
            ${txs.slice(0, 5).map(txRow).join('')}
          </section>
          <a class="see-all" href="#operations">Tout afficher</a>
        </div>
        ${bottomNav('comptes')}
      </div>`;
  }

  function detailScreen(id) {
    const t = txById[id];
    if (!t) return notFoundScreen();
    const st = STATUS[t.status] || STATUS.done;
    const cat = state.categories[t.id];
    return `
      <div class="screen detail">
        ${appbar('Détails', `<button class="icon-btn" data-action="download" aria-label="Télécharger le reçu">${I.download}</button>`)}
        <div class="scroll">
          <section class="detail-head">
            <div>
              <div class="detail-amount">${money(t.amount, true)}</div>
              <div class="detail-name">${esc(t.label)}</div>
              <p class="detail-desc">${txDescription(t)}</p>
            </div>
            <div class="detail-icon">${txIcon(t)}</div>
          </section>

          <section class="info-card">
            <div class="info-row"><span>Date &amp; Heure</span><strong>${fullDate(parseDate(t.date))}</strong></div>
            <div class="info-row ${st.cls}"><span>Statut</span><strong>${st.label}</strong></div>
            <div class="info-row"><span>Frais</span><strong>${t.fee ? money(t.fee) : 'Gratuit'}</strong></div>
            <div class="info-row"><span>Montant (sans les frais)</span><strong>${money(t.amount)}</strong></div>
            <div class="info-row tall"><span>Nouveau Solde<br>Courant</span><strong>${money(t.balanceAfter)}</strong></div>
          </section>

          <section class="ref-card">
            <div>
              <div class="ref-title">Référence</div>
              <div class="ref-code">${esc(t.reference)}</div>
            </div>
            <button class="icon-btn" data-action="copy-ref" data-ref="${esc(t.reference)}" aria-label="Copier la référence">${I.copy}</button>
          </section>

          <button class="category${cat ? ' has-value' : ''}" data-action="category" data-id="${esc(t.id)}">
            <span class="cat-text">
              <span class="cat-label">Catégorie</span>
              ${cat ? `<span class="cat-value">${esc(cat)}</span>` : ''}
            </span>
            ${I.caretDown}
          </button>
        </div>
      </div>`;
  }

  function listScreen() {
    const f = state.filter;
    const list = txs.filter((t) => (f === 'in' ? t.amount > 0 : f === 'out' ? t.amount < 0 : true));
    const groups = [];
    list.forEach((t) => {
      const day = t.date.slice(0, 10);
      const last = groups[groups.length - 1];
      if (last && last.day === day) last.items.push(t);
      else groups.push({ day, items: [t] });
    });
    const chip = (key, label) =>
      `<button class="chip${f === key ? ' active' : ''}" data-action="filter" data-filter="${key}">${label}</button>`;
    return `
      <div class="screen list">
        ${appbar('Opérations')}
        <div class="filters">${chip('all', 'Tout')}${chip('in', 'Entrées')}${chip('out', 'Sorties')}</div>
        <div class="scroll">
          ${groups.length
            ? groups.map((g) => `<div class="day-head">${dayTitle(parseDate(g.day))}</div>${g.items.map(txRow).join('')}`).join('')
            : '<p class="empty">Aucune opération.</p>'}
          <div style="height:24px"></div>
        </div>
      </div>`;
  }

  function cardScreen() {
    const frozen = state.cardFrozen;
    const hidden = state.hideBalance;
    return `
      <div class="screen card">
        ${appbar('Carte')}
        <div class="scroll">
          <div class="vcard${frozen ? ' frozen' : ''}">
            <div class="vcard-brand">${esc(D.bankName)}</div>
            ${frozen ? `<div class="vcard-frozen-badge">${I.snowflake}<span>Gelée</span></div>` : ''}
            <div class="vcard-chip"></div>
            <div class="vcard-number">•••• •••• •••• ${esc(D.card.last4)}</div>
            <div class="vcard-meta"><span>${esc(D.user.name.toUpperCase())}</span><span>EXP ${esc(D.card.expiry)}</span></div>
          </div>
          <div class="card-balance">
            <div class="lbl">Solde de la carte</div>
            <div class="val">${hidden ? '••• F' : money(D.card.balance)}</div>
          </div>
          <div class="card-actions">
            <button class="qa" data-action="soon" data-label="Recharger"><span class="qa-circle">${I.transfer}</span><span class="qa-label">Recharger</span></button>
            <button class="qa" data-action="freeze"><span class="qa-circle" style="color:var(--blue)">${frozen ? I.lock : I.snowflake}</span><span class="qa-label">${frozen ? 'Dégeler' : 'Geler'}</span></button>
            <button class="qa" data-action="soon" data-label="Paramètres"><span class="qa-circle" style="color:var(--blue)">${I.cardLine}</span><span class="qa-label">Paramètres</span></button>
          </div>
        </div>
      </div>`;
  }

  const TABS = {
    epargne: { title: 'Épargne', icon: I.safe, h: 'Mettez de côté sans effort', p: 'Créez des coffres pour vos projets et faites fructifier votre argent.', cta: 'Créer un coffre' },
    investir: { title: 'Investir', icon: I.invest, h: 'Investissez dès 5.000 F', p: 'Accédez à des placements simples, adaptés à vos objectifs.', cta: 'Découvrir' },
    credit: { title: 'Crédit', icon: I.credit, h: 'Un coup de pouce quand il faut', p: 'Demandez une avance sur salaire ou un petit prêt en quelques minutes.', cta: 'Faire une demande' },
  };
  function tabScreen(key) {
    const t = TABS[key];
    return `
      <div class="screen tab">
        <div class="scroll">
          ${topbar()}
          <div class="tab-title">${t.title}</div>
          <section class="soon">
            <div class="soon-icon">${t.icon}</div>
            <h2>${t.h}</h2>
            <p>${t.p}</p>
            <button class="btn-primary" data-action="soon" data-label="${esc(t.cta)}">${I.plus}<span>${t.cta}</span></button>
          </section>
        </div>
        ${bottomNav(key)}
      </div>`;
  }

  function notFoundScreen() {
    return `
      <div class="screen">
        ${appbar('Introuvable')}
        <p class="empty">Cette page n'existe pas.</p>
      </div>`;
  }

  /* ---------------- Routeur ---------------- */
  const DEPTH = { home: 0, epargne: 0, investir: 0, credit: 0, operations: 1, carte: 1, operation: 2, notfound: 1 };
  // Pile des écrans visités dans l'app, pour que « retour » ne quitte jamais l'application.
  // Adresses simples (#comptes, #operations, #operation-t1, #carte…), compatibles
  // avec les visualiseurs qui n'acceptent que des noms d'ancre sans « / ».
  const HOME = '#comptes';
  const currentHash = () => location.hash || HOME;
  const stack = [currentHash()];

  function parseRoute() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    if (h === '' || h === 'comptes' || h === 'home') return { name: 'home' };
    const op = /^operation[-/](.+)$/.exec(h);
    if (op) return { name: 'operation', arg: op[1] };
    if (['operations', 'carte', 'epargne', 'investir', 'credit'].includes(h)) return { name: h };
    return { name: 'notfound' };
  }

  function render(opts = {}) {
    const prev = state.current;
    const route = parseRoute();

    // Mémorise la position de défilement de l'accueil
    if (prev && prev.name === 'home') {
      const sc = app.querySelector('.scroll');
      if (sc) state.homeScroll = sc.scrollTop;
    }

    let html;
    switch (route.name) {
      case 'home': html = homeScreen(); break;
      case 'operation': html = detailScreen(route.arg); break;
      case 'operations': html = listScreen(); break;
      case 'carte': html = cardScreen(); break;
      case 'epargne': case 'investir': case 'credit': html = tabScreen(route.name); break;
      default: html = notFoundScreen();
    }

    // Conserve un éventuel toast affiché
    const toast = app.querySelector('.toast');
    app.innerHTML = html;
    if (toast) app.appendChild(toast);

    const screen = app.querySelector('.screen');
    const sameRoute = prev && prev.name === route.name && prev.arg === route.arg;
    if (!opts.silent && !sameRoute && prev) {
      const dPrev = DEPTH[prev.name] ?? 0;
      const dNext = DEPTH[route.name] ?? 0;
      screen.classList.add(dNext > dPrev ? 'anim-push' : dNext < dPrev ? 'anim-pop' : 'anim-fade');
    }

    if (route.name === 'home' && (!prev || prev.name !== 'home' || opts.silent)) {
      const sc = screen.querySelector('.scroll');
      if (sc) sc.scrollTop = state.homeScroll;
    }

    const titles = { home: 'Comptes', operation: 'Détails', operations: 'Opérations', carte: 'Carte', epargne: 'Épargne', investir: 'Investir', credit: 'Crédit' };
    document.title = `${titles[route.name] || D.bankName} · ${D.bankName}`;
    state.current = route;
  }

  window.addEventListener('hashchange', () => {
    const h = currentHash();
    if (stack.length > 1 && stack[stack.length - 2] === h) stack.pop();
    else if (stack[stack.length - 1] !== h) stack.push(h);
    render();
  });

  function goBack() {
    closeSheet();
    if (stack.length > 1) {
      history.back();
    } else {
      // Ouvert directement sur une page secondaire : on remonte à l'accueil.
      stack[0] = HOME;
      location.replace(HOME);
    }
  }

  /* ---------------- Toast & feuille du bas ---------------- */
  let toastTimer = null;
  function toast(msg) {
    let el = app.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      app.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2300);
  }

  function openSheet(inner, onClick) {
    closeSheet();
    const back = document.createElement('div');
    back.className = 'sheet-backdrop';
    back.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="sheet-grip"></div>${inner}</div>`;
    back.addEventListener('click', (e) => {
      if (e.target === back) return closeSheet();
      const item = e.target.closest('[data-sheet]');
      if (item && onClick) onClick(item.dataset.sheet, item);
    });
    app.appendChild(back);
  }
  function closeSheet() {
    const s = app.querySelector('.sheet-backdrop');
    if (s) s.remove();
  }

  const sheetItem = (key, icon, text, end = I.chevronRight, endCls = '') =>
    `<button class="sheet-item" data-sheet="${esc(key)}"><span class="si-icon">${icon}</span><span class="si-text">${text}</span><span class="si-end ${endCls}">${end}</span></button>`;

  /* ---------------- Actions ---------------- */
  const actions = {
    'toggle-balance'() {
      state.hideBalance = !state.hideBalance;
      store.set('hideBalance', state.hideBalance);
      render({ silent: true });
    },
    deposit() {
      openSheet(
        `<h3>Déposer de l'argent</h3><p class="sub">Choisissez comment alimenter votre ${esc(D.account.label.toLowerCase())}.</p>` +
          sheetItem('agent', I.agent, "Chez un agent") +
          sheetItem('mobile', I.phone, 'Par Mobile Money') +
          sheetItem('card', I.cardLine, 'Par carte bancaire') +
          sheetItem('transfer', I.bank, 'Par virement bancaire'),
        (key, el) => {
          closeSheet();
          toast(`${el.querySelector('.si-text').textContent} : fonctionnalité de démonstration`);
        }
      );
    },
    qr() {
      openSheet(
        `<h3 class="center">Mon QR code</h3><p class="sub center">Faites scanner ce code pour recevoir de l'argent sur votre compte ${esc(D.bankName)}.</p>
         <div class="qr-big"><div class="qr-inner">${qrMarkup()}<span class="qr-logo lg">k</span></div></div>
         <p class="sub center"><strong style="color:var(--ink)">${esc(D.user.name)}</strong></p>` +
          sheetItem('close', I.close, 'Fermer', '', ''),
        () => closeSheet()
      );
    },
    'account-number'() {
      openSheet(
        `<h3>Mon numéro de compte</h3><p class="sub">Communiquez ce numéro pour recevoir des virements.</p>` +
          sheetItem('copy', I.copy, `<span style="letter-spacing:.4px">${esc(D.account.number)}</span>`, '', '') +
          sheetItem('close', I.close, 'Fermer', '', ''),
        (key) => {
          if (key === 'copy') copy(D.account.number, 'Numéro de compte copié');
          closeSheet();
        }
      );
    },
    help() {
      toast('Notre service client vous répond 7j/7 (démo)');
    },
    profile() {
      toast(`Connecté en tant que ${D.user.name}`);
    },
    soon(el) {
      toast(`${el.dataset.label || 'Cette fonctionnalité'} : bientôt disponible`);
    },
    back() {
      goBack();
    },
    download() {
      toast("Le téléchargement du reçu n'est pas disponible dans cette démo");
    },
    'copy-ref'(el) {
      copy(el.dataset.ref, 'Référence copiée');
    },
    category(el) {
      const id = el.dataset.id;
      const current = state.categories[id];
      openSheet(
        `<h3>Catégorie</h3><p class="sub">Classez cette opération pour suivre votre budget.</p>` +
          D.categories.map((c) => sheetItem(c, I.budget.replace('viewBox', 'style="width:22px;height:22px" viewBox'), esc(c), c === current ? I.check : '', '')).join('') +
          (current ? sheetItem('__none', I.close, 'Retirer la catégorie', '', 'muted') : ''),
        (key) => {
          if (key === '__none') delete state.categories[id];
          else state.categories[id] = key;
          store.set('categories', state.categories);
          closeSheet();
          render({ silent: true });
        }
      );
    },
    filter(el) {
      state.filter = el.dataset.filter;
      render({ silent: true });
    },
    freeze() {
      state.cardFrozen = !state.cardFrozen;
      store.set('cardFrozen', state.cardFrozen);
      render({ silent: true });
      toast(state.cardFrozen ? 'Carte gelée' : 'Carte dégelée');
    },
  };

  function copy(text, msg) {
    const done = () => toast(msg);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    ta.remove();
    done();
  }

  app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || !app.contains(el)) return;
    const fn = actions[el.dataset.action];
    if (fn) {
      e.preventDefault();
      fn(el);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });

  /* ---------------- Démarrage ---------------- */
  render({ silent: true });

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
