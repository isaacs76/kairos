/* Icônes SVG de l'application (dessins originaux). */
(function () {
  // Les attributs de `extra` sont placés en premier : en HTML, le premier attribut l'emporte.
  const line = (body, extra = '') =>
    `<svg ${extra} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

  const doodle = (body) =>
    `<svg viewBox="0 0 48 48" aria-hidden="true"><g stroke="#26262e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;

  window.ICONS = {
    /* ---------- Icônes au trait ---------- */
    headset: line(
      '<path d="M4.5 13.5V12a7.5 7.5 0 0 1 15 0v1.5"/>' +
        '<rect x="3" y="12.5" width="4" height="6" rx="1.8"/>' +
        '<rect x="17" y="12.5" width="4" height="6" rx="1.8"/>' +
        '<path d="M19 18.5c0 1.7-1.3 3-3 3h-2.5"/>' +
        '<path d="M9.5 13.2c.7.6 1.6.9 2.5.9s1.8-.3 2.5-.9"/>'
    ),
    eye: line('<path d="M2 12c1.2-2.8 5-7 10-7s8.8 4.2 10 7c-1.2 2.8-5 7-10 7S3.2 14.8 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: line(
      '<path d="M3 3l18 18"/>' +
        '<path d="M10.6 5.1c.5-.1.9-.1 1.4-.1 5 0 8.8 4.2 10 7-.5 1.1-1.3 2.4-2.4 3.6"/>' +
        '<path d="M6.6 6.6C4.4 8 2.8 10.1 2 12c1.2 2.8 5 7 10 7 1.8 0 3.4-.5 4.8-1.3"/>' +
        '<path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'
    ),
    plus: line('<path d="M12 5v14M5 12h14"/>', 'stroke-width="2.4"'),
    chevronRight: line('<path d="M9 5.5l6.5 6.5L9 18.5"/>', 'stroke-width="2.2"'),
    arrowLeft: line('<path d="M20 12H4.5M10.5 5.5L4 12l6.5 6.5"/>', 'stroke-width="2.2"'),
    download: line('<path d="M12 3.5v11M7.5 10l4.5 4.5 4.5-4.5"/><path d="M4 15v4.5h16V15"/>', 'stroke-width="2.2"'),
    copy: line('<rect x="8.5" y="7.5" width="11.5" height="13.5" rx="1.6"/><path d="M5 16.5V4.6C5 3.7 5.7 3 6.6 3H16"/>', 'stroke-width="2"'),
    caretDown: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 9.5h11L12 15.5z" fill="currentColor"/></svg>',
    check: line('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 'stroke-width="2.4"'),
    close: line('<path d="M6 6l12 12M18 6L6 18"/>', 'stroke-width="2.2"'),
    snowflake: line('<path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6"/><path d="M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>'),
    lock: line('<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'),
    cardLine: line('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/>'),
    agent: line('<path d="M4 20v-1.5A4.5 4.5 0 0 1 8.5 14h7a4.5 4.5 0 0 1 4.5 4.5V20"/><circle cx="12" cy="7.5" r="3.5"/>'),
    phone: line('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>'),
    bank: line(
      '<path d="M3 9.5L12 4l9 5.5"/><path d="M4 9.5h16"/><path d="M6.5 10v7M10 10v7M14 10v7M17.5 10v7"/><path d="M4 17.5h16M3 20.5h18"/>'
    ),
    safe: line(
      '<rect x="3" y="3.5" width="18" height="15" rx="2.2"/><circle cx="12" cy="11" r="3.6"/><path d="M12 7.4V9M12 13v1.6M8.4 11H10M14 11h1.6"/><path d="M6.5 18.5v2M17.5 18.5v2"/>'
    ),
    invest: line(
      '<path d="M4 21v-4M8.5 21v-7M13 21v-5M17.5 21v-9"/><path d="M3.5 12.5l5-5 4 3.5 7.5-7.5"/><path d="M15.5 3.5H20V8"/>'
    ),
    credit: line(
      '<path d="M9 2.8h6l-1.6 3.4h-2.8z"/><path d="M10.6 6.2C6.4 8.2 4 12.4 4 15.6 4 18.6 6.3 21 9.3 21h5.4c3 0 5.3-2.4 5.3-5.4 0-3.2-2.4-7.4-6.6-9.4"/><circle cx="12" cy="14.6" r="2.6"/>'
    ),
    search: line('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'),

    /* ---------- Icônes colorées (actions rapides) ---------- */
    transfer: doodle(
      '<rect x="3.5" y="17" width="9.5" height="15" rx="2.6" fill="#f59e0b"/>' +
        '<path d="M13 19.2H27V12l16 12.5L27 37v-7.2H13z" fill="#ffc93c"/>' +
        '<path d="M17 24.6h7" fill="none"/>'
    ),
    bills: doodle(
      '<path d="M10 5h22v35l-3.7-2.6-3.6 2.6-3.7-2.6-3.6 2.6-3.7-2.6L10 40z" fill="#9ee6bf"/>' +
        '<path d="M15 12.5h12M15 18.5h12M15 24.5h6" fill="none"/>' +
        '<rect x="24" y="24.5" width="18" height="13" rx="2.6" fill="#e7fbef"/>' +
        '<path d="M28 31h10" fill="none"/>'
    ),
    accountNumber: doodle(
      '<path d="M9 4.5h21l9 9V43H9z" fill="#ffffff"/>' +
        '<path d="M9 34.5h30V43H9z" fill="#f05252"/>' +
        '<path d="M30 4.5v9h9z" fill="#ffd23f"/>' +
        '<text x="13" y="21" font-family="Figtree, sans-serif" font-size="9.5" font-weight="800" fill="#26262e" stroke="none">CI</text>' +
        '<text x="12.5" y="31" font-family="Figtree, sans-serif" font-size="9.5" font-weight="800" fill="#26262e" stroke="none">001</text>'
    ),
    budget: doodle(
      '<rect x="6" y="27" width="7.5" height="15" rx="1.6" fill="#ffc93c"/>' +
        '<rect x="15.5" y="8" width="7.5" height="34" rx="1.6" fill="#d8f6e4"/>' +
        '<rect x="25" y="4.5" width="7.5" height="37.5" rx="1.6" fill="#5ccf8f"/>' +
        '<rect x="34.5" y="16" width="7.5" height="26" rx="1.6" fill="#f05252"/>'
    ),
    business: doodle(
      '<path d="M17.5 13v-3.2c0-1.2 1-2.3 2.3-2.3h8.4c1.3 0 2.3 1.1 2.3 2.3V13" fill="none"/>' +
        '<rect x="5" y="13" width="38" height="28" rx="3.6" fill="#5f6470"/>' +
        '<path d="M5 16.6C5 14.6 6.6 13 8.6 13h30.8c2 0 3.6 1.6 3.6 3.6V26H5z" fill="#f26b6b"/>' +
        '<rect x="20.5" y="22" width="7" height="9" rx="2" fill="#ffc93c"/>'
    ),
    cardPouch: doodle(
      '<g transform="rotate(-14 24 22)"><rect x="11" y="3" width="22" height="32" rx="3" fill="#a3a8b4"/>' +
        '<path d="M23.5 9.5l-6.5 10h5.2L20 28l7.5-10.8h-5.3z" fill="#ffc93c"/></g>' +
        '<path d="M5 27.5h33l-3.5 15h-26z" fill="#4b5160"/>'
    ),

    /* ---------- Icônes des opérations ---------- */
    txMobile:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#ff7a03"/>' +
      '<rect x="10.5" y="10.5" width="27" height="27" rx="10" fill="none" stroke="#ffd166" stroke-width="2.2"/>' +
      '<rect x="14" y="14" width="20" height="20" rx="7" fill="none" stroke="#ff9fbd" stroke-width="2"/>' +
      '<path d="M19 29l10-10M20.5 18.8H29v8.5" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    txDeposit:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#cbeddd"/>' +
      '<g stroke="#26262e" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' +
      '<rect x="11" y="11" width="26" height="15" rx="2" fill="#34c47c"/>' +
      '<circle cx="24" cy="18.5" r="3.6" fill="#e9fbef"/>' +
      '<path d="M12 29.5h7.5l5 2.8h7.2a2.2 2.2 0 0 1 0 4.4H20.5L12 34.5z" fill="#9b5a46"/></g></svg>',
    txCrown:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><g stroke="#26262e" stroke-width="2.2" stroke-linejoin="round">' +
      '<path d="M9 35L6 16.5l10 7.5 8-12.5 8 12.5 10-7.5-3 18.5z" fill="#ffc93c"/>' +
      '<rect x="8.5" y="35" width="31" height="6.5" rx="2" fill="#26262e"/></g>' +
      '<circle cx="6" cy="15.5" r="3" fill="#f05252"/><circle cx="24" cy="10.5" r="3.2" fill="#3b82f6"/><circle cx="42" cy="15.5" r="3" fill="#22c55e"/>' +
      '<circle cx="16" cy="22" r="2.2" fill="#f05252"/><circle cx="32" cy="22" r="2.2" fill="#3b82f6"/></svg>',
    txBill:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#dfe0ff"/>' +
      '<g stroke="#26262e" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M16 11h16v26l-2.7-1.9-2.6 1.9-2.7-1.9-2.6 1.9-2.7-1.9L16 37z" fill="#ffd23f"/>' +
      '<path d="M20 18h8M20 23h8M20 28h4" fill="none"/></g></svg>',
    txIncoming:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#2b3fff"/>' +
      '<path d="M29 19L19 29M27.5 29.2H19v-8.5" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    txCard:
      '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="24" fill="#1c1b20"/>' +
      '<rect x="12" y="15" width="24" height="18" rx="3" fill="none" stroke="#fff" stroke-width="2.4"/>' +
      '<path d="M12 21h24M16 28h5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',

    /* ---------- Divers ---------- */
    avatar:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="#e9dccb"/>' +
      '<circle cx="32" cy="26" r="12" fill="#6b4a3a"/>' +
      '<path d="M10 64c2-13 11-20 22-20s20 7 22 20z" fill="#3c5a7a"/></svg>',
  };
})();
