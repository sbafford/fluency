import type { Conversation } from '../../engine/types'
import { unit1Items } from './unit1'
import { unit2Items } from './unit2'

const { g, n, o, c } = unit1Items
const { h, w } = unit2Items

const NAME = { label: 'say your name', any: ["je m'appelle", 'je suis', "moi c'est"] }

/*
 * Scripted role-plays. The learner writes or says their own response; it is
 * accepted when it contains each required part (a slot), so there is room to
 * phrase things your own way.
 */

export const conversations: Conversation[] = [
  {
    id: 'fr.u1.talk.arrival',
    unitId: 'fr.u1',
    level: 'A1',
    title: 'Arriving at the Conference',
    place: 'The Welcome Desk',
    setting: 'You arrive at the welcome desk. Nathalie is checking people in.',
    register: 'formal',
    partner: { name: 'Nathalie', voice: 'a' },
    turns: [
      { kind: 'partner', target: 'Bonjour, bienvenue ! Comment vous appelez-vous ?', native: "Hello, welcome! What's your name?" },
      {
        kind: 'learner',
        goal: 'Greet her and tell her your name.',
        slots: [{ label: 'greet her', any: ['bonjour', 'bonsoir'] }, NAME],
        models: ["Bonjour, je m'appelle {name}."],
      },
      { kind: 'partner', target: "Enchantée ! Vous venez d'où ?", native: 'Nice to meet you! Where are you from?' },
      {
        kind: 'learner',
        goal: "Say where you're from.",
        slots: [{ label: "say where you're from", any: ['je viens de', "je viens d'", 'je suis de'] }],
        models: ["Je viens d'Australie.", 'Je viens de Perth.'],
        tip: "Use de before a consonant and d' before a vowel: je viens de Perth, je viens d'Australie.",
      },
      { kind: 'partner', target: 'Et vous habitez où ?', native: 'And where do you live?' },
      {
        kind: 'learner',
        goal: 'Say where you live.',
        slots: [{ label: 'say where you live', any: ["j'habite à", "j'habite en", "j'habite au", "j'habite aux"] }],
        models: ["J'habite à Perth.", "J'habite en Australie."],
        tip: 'À with a city, en with most countries.',
      },
      { kind: 'partner', target: 'Très bien. Voici votre badge. Bonne conférence !', native: 'Very good. Here is your badge. Enjoy the conference!' },
      {
        kind: 'learner',
        goal: 'Thank her and say goodbye.',
        slots: [
          { label: 'thank her', any: ['merci'] },
          { label: 'say goodbye', any: ['au revoir', 'à bientôt', 'bonne journée'] },
        ],
        models: ['Merci, au revoir !'],
      },
    ],
    itemIds: [g.bonjour.id, n.jemappelle.id, o.jeviens.id, o.jhabite.id, g.merci.id, g.aurevoir.id],
  },
  {
    id: 'fr.u1.talk.cafe',
    unitId: 'fr.u1',
    level: 'A1',
    title: 'Ordering at the Café',
    place: 'A Café Terrace',
    setting: 'You sit down at a café terrace. The waiter comes over.',
    register: 'formal',
    partner: { name: 'Le serveur', voice: 'b', pitch: 0.85 },
    turns: [
      { kind: 'partner', target: "Bonjour ! Qu'est-ce que vous prenez ?", native: 'Hello! What will you have?' },
      {
        kind: 'learner',
        goal: 'Greet him and order a coffee, politely.',
        slots: [
          { label: 'greet him', any: ['bonjour', 'bonsoir'] },
          { label: 'ask politely', any: ['je voudrais', "s'il vous plaît"] },
          { label: 'ask for a coffee', any: ['un café'] },
        ],
        models: ["Bonjour, je voudrais un café, s'il vous plaît."],
      },
      { kind: 'partner', target: 'Un café. Et avec ça ?', native: 'One coffee. Anything else?' },
      {
        kind: 'learner',
        goal: 'Ask for a jug of tap water.',
        slots: [{ label: 'ask for a jug of tap water', any: ["une carafe d'eau"] }],
        models: ["Une carafe d'eau, s'il vous plaît."],
        tip: "Carafe is feminine: une carafe d'eau.",
      },
      { kind: 'partner', target: 'Très bien, je vous apporte ça.', native: "Very good, I'll bring that for you." },
      {
        kind: 'learner',
        goal: 'Later: ask for the bill and how much it is.',
        slots: [
          { label: 'ask for the bill', any: ["l'addition"] },
          { label: 'ask how much', any: ['combien'] },
        ],
        models: ["L'addition, s'il vous plaît. C'est combien ?"],
      },
      { kind: 'partner', target: "Ça fait quatre euros, s'il vous plaît.", native: "That's four euros, please." },
      {
        kind: 'learner',
        goal: 'Pay, thank him and wish him a good day.',
        slots: [
          { label: 'thank him', any: ['merci'] },
          { label: 'wish him a good day', any: ['bonne journée'] },
        ],
        models: ['Voilà. Merci, bonne journée !'],
      },
      { kind: 'partner', target: 'Merci, vous aussi ! Au revoir.', native: 'Thank you, you too! Goodbye.' },
    ],
    itemIds: [c.jevoudrais.id, c.cafe.id, c.carafe.id, c.addition.id, c.combien.id, c.bonnejournee.id],
  },
  {
    id: 'fr.u1.talk.friend',
    unitId: 'fr.u1',
    level: 'A1',
    title: "Meeting a Friend's Friend",
    place: 'At a Picnic',
    setting: 'At a picnic, a friend of a friend comes over to say hello.',
    register: 'informal',
    partner: { name: 'Léa', voice: 'a' },
    turns: [
      { kind: 'partner', target: 'Salut ! Ça va ?', native: "Hi! How's it going?" },
      {
        kind: 'learner',
        goal: "Say hi, say you're fine, and ask how she is.",
        slots: [
          { label: 'say hi', any: ['salut', 'bonjour'] },
          { label: "say you're fine", any: ['ça va', 'bien'] },
          { label: 'ask "and you?" informally', any: ['et toi'] },
        ],
        models: ['Salut ! Ça va bien, et toi ?'],
        tip: 'With friends, use toi rather than vous.',
      },
      { kind: 'partner', target: "Très bien ! Moi, c'est Léa. Tu t'appelles comment ?", native: "Very good! I'm Léa. What's your name?" },
      { kind: 'learner', goal: 'Tell her your name.', slots: [NAME], models: ["Moi, c'est {name}."] },
      { kind: 'partner', target: "Enchantée ! Tu viens d'où ?", native: 'Nice to meet you! Where are you from?' },
      {
        kind: 'learner',
        goal: "Say it's nice to meet her, and where you're from.",
        slots: [
          { label: 'say nice to meet you', any: ['enchanté(e)'] },
          { label: "say where you're from", any: ['je viens de', "je viens d'", 'je suis de'] },
        ],
        models: ["Enchantée ! Je viens d'Australie."],
      },
      { kind: 'partner', target: 'Super ! Bon, à bientôt !', native: 'Great! Well, see you soon!' },
      {
        kind: 'learner',
        goal: 'Say bye, see you soon.',
        slots: [{ label: 'say see you soon', any: ['à bientôt'] }],
        models: ['Salut, à bientôt !'],
      },
    ],
    itemIds: [g.salut.id, g.cava.id, g.ettoi.id, n.moicest.id, n.enchante.id, o.jeviens.id, g.abientot.id],
  },
  {
    id: 'fr.u2.talk.table',
    unitId: 'fr.u2',
    level: 'A1',
    title: 'Booking a Table',
    place: 'Phoning a Restaurant',
    setting: 'You phone a restaurant to book dinner for four.',
    register: 'formal',
    partner: { name: 'Le restaurant', voice: 'b', pitch: 0.85 },
    turns: [
      { kind: 'partner', target: 'Restaurant Le Lys, bonjour !', native: 'Le Lys restaurant, hello!' },
      {
        kind: 'learner',
        goal: "Greet them and say you'd like a table for four people.",
        slots: [
          { label: 'greet them', any: ['bonjour', 'bonsoir'] },
          { label: 'ask politely', any: ['je voudrais'] },
          { label: 'say four', any: ['quatre', '4'] },
        ],
        models: ["Bonjour, je voudrais une table pour quatre personnes, s'il vous plaît."],
        tip: 'A table for four: une table pour quatre.',
      },
      { kind: 'partner', target: 'Pour quel jour ?', native: 'For which day?' },
      { kind: 'learner', goal: 'Say Saturday.', slots: [{ label: 'say Saturday', any: ['samedi'] }], models: ["Pour samedi, s'il vous plaît."] },
      { kind: 'partner', target: 'Samedi, très bien. À quelle heure ?', native: 'Saturday, very good. At what time?' },
      {
        kind: 'learner',
        goal: 'Say at eight in the evening.',
        slots: [{ label: 'say at eight', any: ['à huit heures', 'à vingt heures', 'à 20 heures', 'à 8 heures', 'à 20 h', 'à 8 h'] }],
        models: ['À vingt heures.', 'À huit heures du soir.'],
        tip: 'Use à before a time: à vingt heures.',
      },
      { kind: 'partner', target: "Parfait. C'est à quel nom ?", native: 'Perfect. What name is it under?' },
      {
        kind: 'learner',
        goal: 'Give your name.',
        slots: [{ label: 'give your name', any: ["c'est", "je m'appelle", 'au nom de'] }],
        models: ["C'est au nom de {name}."],
        tip: "Au nom de means 'in the name of'.",
      },
      { kind: 'partner', target: 'Merci. À samedi !', native: 'Thank you. See you on Saturday!' },
      {
        kind: 'learner',
        goal: 'Thank them and say goodbye.',
        slots: [
          { label: 'thank them', any: ['merci'] },
          { label: 'say goodbye', any: ['au revoir', 'à samedi', 'bonne journée', 'bonne soirée'] },
        ],
        models: ['Merci, à samedi !'],
      },
    ],
    itemIds: [c.jevoudrais.id, w.samedi.id, h.aquelleheure.id, h.dusoir.id, g.merci.id],
  },
  {
    id: 'fr.u2.talk.plans',
    unitId: 'fr.u2',
    level: 'A1',
    title: 'Making Weekend Plans',
    place: 'Messages With Hugo',
    setting: 'Hugo messages you about the weekend.',
    register: 'informal',
    partner: { name: 'Hugo', voice: 'a', pitch: 0.8 },
    turns: [
      { kind: 'partner', target: 'Salut ! Tu es libre ce week-end ?', native: 'Hi! Are you free this weekend?' },
      {
        kind: 'learner',
        goal: "Say yes, on Sunday.",
        slots: [
          { label: 'say yes', any: ['oui'] },
          { label: 'say Sunday', any: ['dimanche'] },
        ],
        models: ['Oui, dimanche !'],
      },
      { kind: 'partner', target: 'Super ! On fait un pique-nique ? À quelle heure ?', native: 'Great! Shall we have a picnic? What time?' },
      { kind: 'learner', goal: 'Suggest midday.', slots: [{ label: 'suggest midday', any: ['midi'] }], models: ['À midi ?'] },
      { kind: 'partner', target: 'Parfait. Moi, j’invite Léa et Sam. Alors, on est quatre !', native: "Perfect. I'm inviting Léa and Sam. So there are four of us!" },
      {
        kind: 'learner',
        goal: 'Say great, see you Sunday.',
        slots: [{ label: 'say see you Sunday', any: ['à dimanche'] }],
        models: ['Super, à dimanche !'],
      },
    ],
    itemIds: [w.weekend.id, w.dimanche.id, h.midi.id, h.aquelleheure.id],
  },
]
