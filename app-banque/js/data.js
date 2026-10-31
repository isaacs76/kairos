/*
 * Données de démonstration de l'application.
 * Tous les noms, numéros et références sont FICTIFS.
 * Modifiez ce fichier pour changer le contenu affiché.
 */
window.BANK_DATA = {
  bankName: 'Kairos',

  user: {
    name: 'Yao Kouassi',
    // Mettez ici le chemin d'une photo (ex. 'img/avatar.jpg') pour remplacer l'avatar par défaut.
    avatar: null,
  },

  account: {
    label: 'Compte courant',
    number: 'CI001 01234 000123456789 42',
    balance: 4118262, // solde actuel en francs CFA
  },

  card: {
    label: 'Carte',
    balance: 578,
    last4: '4821',
    expiry: '09/29',
  },

  // Les plus récentes en premier. Le « nouveau solde » de chaque opération
  // est recalculé automatiquement à partir du solde actuel du compte.
  transactions: [
    {
      id: 't1',
      type: 'mobile_transfer',
      label: 'À Aïcha Koné Ma Sœur',
      counterparty: 'Aïcha Koné Ma Sœur',
      phone: '+2250700000001',
      operator: 'Mobile Money',
      amount: -25000,
      fee: 0,
      date: '2026-10-30T17:48',
      status: 'done',
      reference: 'KRSQ7HD2LM5XWP8TZB4NC9VR',
    },
    {
      id: 't2',
      type: 'mobile_transfer',
      label: 'À Moussa Tonton Bamba',
      counterparty: 'Moussa Tonton Bamba',
      phone: '+2250500000002',
      operator: 'Mobile Money',
      amount: -50000,
      fee: 0,
      date: '2026-10-29T19:47',
      status: 'done',
      reference: 'KRSF3KW8PX2NQ6TJM9BV5HDA',
    },
    {
      id: 't3',
      type: 'mobile_transfer',
      label: 'À Aïcha Koné Ma Sœur',
      counterparty: 'Aïcha Koné Ma Sœur',
      phone: '+2250700000001',
      operator: 'Mobile Money',
      amount: -35000,
      fee: 0,
      date: '2026-10-29T19:45',
      status: 'done',
      reference: 'KRSB8NV4QT7MZK2XHP6WD3LJ',
    },
    {
      id: 't4',
      type: 'cash_deposit',
      label: "Dépôt cash chez l'agent",
      counterparty: 'Agent Kairos – Cocody Angré',
      amount: 41000,
      fee: 0,
      date: '2026-10-29T18:52',
      status: 'done',
      reference: 'KRSD5TR9WM3HX7KQ2NB8VPZC',
    },
    {
      id: 't5',
      type: 'subscription',
      label: 'Abonnement',
      counterparty: 'Kairos Premium',
      amount: -2000,
      fee: 0,
      date: '2026-10-29T00:01',
      status: 'done',
      reference: 'KRSM2XW6KD9PT4NV8QH3BZRL',
    },
    {
      id: 't6',
      type: 'bill',
      label: 'Facture électricité',
      counterparty: 'Électricité – Compteur 0123456',
      amount: -18450,
      fee: 0,
      date: '2026-10-27T12:14',
      status: 'done',
      reference: 'KRSH9ZQ4VB7LM2TX6WK3NDPF',
    },
    {
      id: 't7',
      type: 'account_transfer_in',
      label: 'De Société Ivoire Services',
      counterparty: 'Société Ivoire Services',
      amount: 650000,
      fee: 0,
      date: '2026-10-25T09:30',
      status: 'done',
      reference: 'KRSP4WN8XK2QD7MT5ZV9HBLR',
    },
    {
      id: 't8',
      type: 'card_topup',
      label: 'Rechargement carte',
      counterparty: 'Carte Kairos',
      amount: -10000,
      fee: 0,
      date: '2026-10-24T16:05',
      status: 'done',
      reference: 'KRSV6TL3MB9XK2WQ8PD4NZHR',
    },
    {
      id: 't9',
      type: 'mobile_transfer',
      label: 'À Ibrahim Collègue',
      counterparty: 'Ibrahim Collègue',
      phone: '+2250100000003',
      operator: 'Mobile Money',
      amount: -15000,
      fee: 0,
      date: '2026-10-22T08:41',
      status: 'done',
      reference: 'KRSK8QM2ZT5WV9XN3HD7BPLC',
    },
  ],

  categories: [
    'Famille',
    'Alimentation',
    'Transport',
    'Logement',
    'Factures',
    'Santé',
    'Loisirs',
    'Shopping',
    'Revenus',
    'Autre',
  ],
};
