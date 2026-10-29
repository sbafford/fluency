import type { Conversation, ListeningPiece } from '../../engine/types'
import { unit1Items } from './unit1'
import { unit2Items } from './unit2'
import { unit5Items } from './unit5'

const { g } = unit1Items
const { t, h, w } = unit2Items
const { r, tr, p } = unit5Items

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

/*
 * Unit 5 listening and role-plays: a station announcement, directions in
 * Annecy, buying a ticket and talking about weekend plans.
 */

export const listening5: ListeningPiece[] = [
  {
    id: 'fr.u5.listen.departures',
    unitId: 'fr.u5',
    level: 'A1',
    title: 'Départs à Lyon Part-Dieu',
    kind: 'announcement',
    setting: 'Announcements in the departure hall at Lyon Part-Dieu station on Saturday morning.',
    speakers: { annonce: { name: 'Annonce', voice: 'a' } },
    lines: [
      { speaker: 'annonce', target: 'Mesdames et messieurs, bonjour.', native: 'Good morning, ladies and gentlemen.' },
      {
        speaker: 'annonce',
        target: "Le train à destination d'Annecy, départ huit heures quinze, partira voie D.",
        native: 'The train to Annecy, departing at 8:15, will leave from track D.',
      },
      { speaker: 'annonce', target: 'Je répète : le train pour Annecy part voie D.', native: 'I repeat: the train to Annecy leaves from track D.' },
      {
        speaker: 'annonce',
        target: 'Le train à destination de Paris, départ huit heures trente, a vingt minutes de retard.',
        native: 'The train to Paris, departing at 8:30, is twenty minutes late.',
      },
      { speaker: 'annonce', target: 'Merci de votre attention et bon voyage !', native: 'Thank you for your attention, and have a good journey!' },
    ],
    questions: [
      { id: 'q1', question: 'Where is the first train going?', options: ['Annecy', 'Paris', 'Geneva', 'Grenoble'], answers: ['Annecy'] },
      { id: 'q2', question: 'What time does it leave?', options: ['8:15', '8:30', '8:50', '9:15'], answers: ['8:15'] },
      { id: 'q3', question: 'Which track does it leave from? Type the letter.', answers: ['D', 'd', 'voie D'], answerLang: 'native' },
      {
        id: 'q4',
        question: "What's the problem with the Paris train?",
        options: ["It's 20 minutes late.", "It's cancelled.", 'It leaves from track D.', "It's 10 minutes late."],
        answers: ["It's 20 minutes late."],
      },
    ],
    itemIds: [tr.train.id, tr.voie.id, h.heures.id, t.vingt.id],
  },
  {
    id: 'fr.u5.listen.directions',
    unitId: 'fr.u5',
    level: 'A1',
    title: "Le chemin de l'hôtel",
    kind: 'dialogue',
    setting: 'In Annecy, Sarah asks a shopkeeper the way to her hotel.',
    speakers: { sarah: { name: 'Sarah', voice: 'b' }, com: { name: 'La commerçante', voice: 'a' } },
    lines: [
      { speaker: 'sarah', target: "Bonjour, madame. Excusez-moi, je cherche l'hôtel du Lac.", native: "Hello, madam. Excuse me, I'm looking for the Hôtel du Lac." },
      { speaker: 'com', target: "L'hôtel du Lac ? C'est près du lac, bien sûr !", native: "The Hôtel du Lac? It's near the lake, of course!" },
      { speaker: 'sarah', target: "C'est loin ?", native: 'Is it far?' },
      { speaker: 'com', target: "Non, c'est à dix minutes à pied. Allez tout droit jusqu'au pont.", native: "No, it's ten minutes' walk. Go straight on as far as the bridge." },
      { speaker: 'com', target: "Après le pont, tournez à droite. L'hôtel est au bout de la rue, à gauche.", native: 'After the bridge, turn right. The hotel is at the end of the street, on the left.' },
      { speaker: 'sarah', target: 'Tout droit, à droite après le pont, et au bout de la rue. Merci beaucoup !', native: 'Straight on, right after the bridge, and at the end of the street. Thank you very much!' },
      { speaker: 'com', target: 'Je vous en prie. Bon séjour à Annecy !', native: "You're welcome. Enjoy your stay in Annecy!" },
    ],
    questions: [
      { id: 'q1', question: 'How long does it take on foot?', options: ['10 minutes', '5 minutes', '15 minutes', '20 minutes'], answers: ['10 minutes'] },
      { id: 'q2', question: 'Where does Sarah go straight on to?', options: ['The bridge', 'The lake', 'The station', 'The church'], answers: ['The bridge'] },
      { id: 'q3', question: 'Which way does she turn after the bridge?', options: ['Right', 'Left', 'Straight on'], answers: ['Right'] },
      {
        id: 'q4',
        question: 'Where is the hotel?',
        options: ['At the end of the street, on the left', 'At the end of the street, on the right', 'On the corner, on the left', 'Next to the bridge'],
        answers: ['At the end of the street, on the left'],
      },
    ],
    itemIds: [r.excusezmoi.id, r.cestloin.id, r.apied.id, r.toutdroit.id, r.tournez.id, r.adroite.id, r.auboutde.id, r.agauche.id],
  },
]

export const conversations5: Conversation[] = [
  {
    id: 'fr.u5.talk.tickets',
    unitId: 'fr.u5',
    level: 'A1',
    title: 'Buying a Train Ticket',
    place: 'The Ticket Office',
    setting: "You're at the ticket office at Lyon Part-Dieu. You want to go to Annecy on Saturday and come back on Sunday.",
    register: 'formal',
    partner: { name: "L'agent", voice: 'b', pitch: 0.9 },
    turns: [
      { kind: 'partner', target: 'Bonjour ! Je peux vous aider ?', native: 'Hello! Can I help you?' },
      {
        kind: 'learner',
        goal: "Greet him and say you're going to Annecy on Saturday.",
        slots: [
          { label: 'greet him', any: ['bonjour', 'bonsoir'] },
          { label: 'say Annecy', any: ['annecy'] },
          { label: 'say Saturday', any: ['samedi'] },
        ],
        models: ['Bonjour, je vais à Annecy samedi.'],
      },
      { kind: 'partner', target: 'Très bien. Un aller simple ?', native: 'Very good. A single?' },
      {
        kind: 'learner',
        goal: "Say you'd like a return, coming back on Sunday.",
        slots: [
          { label: 'ask for a return', any: ['aller-retour'] },
          { label: 'say Sunday', any: ['dimanche'] },
        ],
        models: ["Non, un aller-retour, s'il vous plaît. Retour dimanche."],
        tip: 'A return is un aller-retour: literally a going-and-coming-back.',
      },
      { kind: 'partner', target: 'Il y a un train samedi à neuf heures dix. Ça vous va ?', native: "There's a train on Saturday at 9:10. Does that suit you?" },
      {
        kind: 'learner',
        goal: 'Say yes, and ask how much it is.',
        slots: [
          { label: 'say yes', any: ['oui', 'parfait', 'très bien', "d'accord", 'ça me va'] },
          { label: 'ask the price', any: ["c'est combien", 'ça fait combien', 'combien'] },
        ],
        models: ["Oui, parfait. C'est combien ?"],
      },
      { kind: 'partner', target: "Quarante-huit euros, s'il vous plaît.", native: 'Forty-eight euros, please.' },
      {
        kind: 'learner',
        goal: 'Ask which track the train leaves from.',
        slots: [{ label: 'ask about the track', any: ['voie', 'quai'] }],
        models: ['Le train part de quelle voie ?', "C'est quelle voie ?"],
        tip: 'The track is la voie.',
      },
      { kind: 'partner', target: "C'est affiché vingt minutes avant le départ. Bon voyage !", native: "It's shown twenty minutes before departure. Have a good journey!" },
      {
        kind: 'learner',
        goal: 'Thank him and say goodbye.',
        slots: [
          { label: 'thank him', any: ['merci'] },
          { label: 'say goodbye', any: ['au revoir', 'bonne journée', 'à bientôt'] },
        ],
        models: ['Merci, au revoir !'],
      },
    ],
    itemIds: [tr.aller.id, tr.allerretour.id, tr.voie.id, g.merci.id, g.aurevoir.id],
  },
  {
    id: 'fr.u5.talk.weekend',
    unitId: 'fr.u5',
    level: 'A1',
    title: 'Plans for the Weekend',
    place: 'The Conference Lobby',
    setting: "It's Friday afternoon. Léa asks about your plans for the weekend.",
    register: 'informal',
    partner: { name: 'Léa', voice: 'a' },
    turns: [
      { kind: 'partner', target: "Salut ! Qu'est-ce que tu vas faire ce week-end ?", native: 'Hi! What are you going to do this weekend?' },
      {
        kind: 'learner',
        goal: "Say one thing you're going to do this weekend.",
        slots: [{ label: "say what you're going to do", any: ['je vais', 'on va', 'nous allons'] }],
        models: ['Je vais visiter Annecy !'],
        tip: 'Aller plus a verb: je vais visiter, je vais rester.',
      },
      { kind: 'partner', target: 'Super ! Tu pars quand ?', native: 'Great! When are you leaving?' },
      {
        kind: 'learner',
        goal: 'Say you leave on Saturday morning.',
        slots: [{ label: 'say Saturday', any: ['samedi'] }],
        models: ['Je pars samedi matin.'],
        tip: 'Je pars means I leave: partir is je pars, tu pars, il part.',
      },
      { kind: 'partner', target: 'Et tu y vas comment ? En voiture ?', native: 'And how are you getting there? By car?' },
      {
        kind: 'learner',
        goal: "Say how you're travelling.",
        slots: [{ label: "say how you're travelling", any: ['en train', 'en bus', 'en voiture', 'en car', 'en tram', 'en métro', 'à vélo', 'à pied'] }],
        models: ['Non, en train.'],
      },
      { kind: 'partner', target: 'Génial. Et la semaine prochaine, on mange ensemble ?', native: 'Brilliant. And next week, shall we have a meal together?' },
      {
        kind: 'learner',
        goal: 'Say yes and suggest a day.',
        slots: [
          { label: 'say yes', any: ['oui', "d'accord", 'avec plaisir', 'bonne idée'] },
          { label: 'suggest a day', any: DAYS },
        ],
        models: ['Oui ! Mardi, ça va ?'],
      },
      { kind: 'partner', target: 'Parfait, mardi ! Bon week-end !', native: 'Perfect, Tuesday! Have a good weekend!' },
      {
        kind: 'learner',
        goal: 'Thank her and say see you then.',
        slots: [
          { label: 'thank her', any: ['merci'] },
          { label: 'say see you then', any: ['à mardi', 'à bientôt', 'à plus', 'salut'] },
        ],
        models: ['Merci, toi aussi ! À mardi !'],
      },
    ],
    itemIds: [p.quefaire.id, p.jevais.id, p.ceweekend.id, tr.en.id, p.semaineprochaine.id, w.mardi.id],
  },
]
