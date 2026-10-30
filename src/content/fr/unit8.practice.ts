import type { Conversation, ListeningPiece } from '../../engine/types'
import { unit1Items } from './unit1'
import { unit2Items } from './unit2'
import { unit8Items } from './unit8'

const { g } = unit1Items
const { w } = unit2Items
const { pc, ga, ra } = unit8Items

/*
 * Unit 8 listening and conversations: a station announcement, Léa's voicemail
 * after the trip, sorting out a cancelled train and telling Hugo about it.
 */

export const listening8: ListeningPiece[] = [
  {
    id: 'fr.u8.listen.announce',
    unitId: 'fr.u8',
    level: 'A2',
    title: 'Votre attention, s’il vous plaît',
    kind: 'announcement',
    setting: 'An announcement at Lyon Part-Dieu on a busy Saturday morning.',
    speakers: { annonce: { name: 'Annonce', voice: 'a' } },
    lines: [
      { speaker: 'annonce', target: "Votre attention, s'il vous plaît.", native: 'Your attention, please.' },
      { speaker: 'annonce', target: 'Le TGV à destination de Marseille, départ dix heures quinze, a un retard de trente minutes.', native: 'The TGV to Marseille, departing at quarter past ten, is thirty minutes late.' },
      { speaker: 'annonce', target: 'Le train à destination de Paris, départ dix heures trente, est annulé.', native: 'The train to Paris, departing at half past ten, is cancelled.' },
      { speaker: 'annonce', target: 'Les voyageurs pour Paris peuvent prendre le train suivant, à onze heures, voie D.', native: 'Passengers for Paris can take the next train, at eleven, platform D.' },
      { speaker: 'annonce', target: 'Nous vous prions de nous excuser pour la gêne occasionnée.', native: 'We apologise for the inconvenience.' },
    ],
    questions: [
      { id: 'q1', question: 'How late is the Marseille train?', options: ['30 minutes', '15 minutes', '10 minutes', '1 hour'], answers: ['30 minutes'] },
      { id: 'q2', question: 'What has happened to the 10:30 train to Paris?', options: ["It's cancelled", "It's late", "It's already left", "It's on time"], answers: ["It's cancelled"] },
      { id: 'q3', question: 'When is the next train to Paris?', options: ['11:00', '10:30', '10:15', '11:30'], answers: ['11:00'] },
      { id: 'q4', question: 'Which platform does it leave from? Type the letter.', answers: ['D', 'voie D', 'la voie D'], answerLang: 'target' },
    ],
    itemIds: [ga.enretard.id, ga.annule.id, ga.suivant.id],
  },
  {
    id: 'fr.u8.listen.voicemail',
    unitId: 'fr.u8',
    level: 'A2',
    title: 'Je suis bien rentrée',
    kind: 'monologue',
    setting: 'Léa stayed in Marseille a day longer. She leaves Sarah a voicemail.',
    speakers: { lea: { name: 'Léa', voice: 'a' } },
    lines: [
      { speaker: 'lea', target: "Salut Sarah, c'est Léa !", native: "Hi Sarah, it's Léa!" },
      { speaker: 'lea', target: "Je suis bien rentrée à Lyon. Le train est arrivé à l'heure, pour une fois !", native: 'I got back to Lyon safely. The train arrived on time, for once!' },
      { speaker: 'lea', target: "Merci pour ce week-end, on s'est bien amusées.", native: 'Thanks for the weekend, we had a great time.' },
      { speaker: 'lea', target: "Petit problème : j'ai oublié ma veste à l'hôtel, dans la chambre cinquante-deux.", native: "Small problem: I left my jacket at the hotel, in room fifty-two." },
      { speaker: 'lea', target: "Tu peux appeler l'hôtel ? Tu as le numéro. Merci, bisous !", native: 'Can you call the hotel? You have the number. Thanks, lots of love!' },
    ],
    questions: [
      { id: 'q1', question: 'Where is Léa now?', options: ['Back in Lyon', 'In Marseille', 'On the train', 'At the hotel'], answers: ['Back in Lyon'] },
      { id: 'q2', question: 'How was her train?', options: ['On time', 'A little late', 'Cancelled', 'Very late'], answers: ['On time'] },
      { id: 'q3', question: 'What did she leave at the hotel?', options: ['Her jacket', 'Her key', 'Her ticket', 'Her phone'], answers: ['Her jacket'] },
      { id: 'q4', question: 'What does she ask Sarah to do? Type it in English.', answers: ['call the hotel', 'phone the hotel', 'ring the hotel', 'to call the hotel', 'to phone the hotel'], answerLang: 'native' },
    ],
    itemIds: [pc.suisrentre.id, ra.onsestamuses.id],
  },
]

export const conversations8: Conversation[] = [
  {
    id: 'fr.u8.talk.ticket',
    unitId: 'fr.u8',
    level: 'A2',
    title: 'A Cancelled Train',
    place: 'The Ticket Office',
    setting: 'Your train to Paris has just been cancelled. You go to the ticket office.',
    register: 'formal',
    partner: { name: "L'agent", voice: 'b' },
    turns: [
      { kind: 'partner', target: 'Bonjour. Je vous écoute.', native: "Hello. How can I help?" },
      {
        kind: 'learner',
        goal: 'Greet him and say your train to Paris is cancelled.',
        slots: [
          { label: 'greet him', any: ['bonjour'] },
          { label: 'say the train is cancelled', any: ['annulé'] },
        ],
        models: ['Bonjour. Mon train pour Paris est annulé.'],
      },
      { kind: 'partner', target: 'Ah oui, je suis désolé. Vous voulez prendre le train suivant ?', native: "Ah yes, I'm sorry. Would you like to take the next train?" },
      {
        kind: 'learner',
        goal: 'Say yes, and ask what time it leaves.',
        slots: [
          { label: 'say yes', any: ['oui', "d'accord"] },
          { label: 'ask what time it leaves', any: ['à quelle heure', 'quelle heure'] },
        ],
        models: ['Oui, il part à quelle heure ?'],
      },
      { kind: 'partner', target: "À onze heures, voie D. J'échange votre billet.", native: "At eleven, platform D. I'll change your ticket." },
      {
        kind: 'learner',
        goal: 'Ask if it is a direct train or if there is a connection.',
        slots: [{ label: 'ask about a connection', any: ['correspondance', 'direct'] }],
        models: ["C'est direct, ou il y a une correspondance ?"],
      },
      { kind: 'partner', target: "C'est direct. Vous arrivez à Paris à treize heures. Voici votre nouveau billet.", native: "It's direct. You arrive in Paris at one o'clock. Here is your new ticket." },
      {
        kind: 'learner',
        goal: 'Thank him and say goodbye.',
        slots: [
          { label: 'thank him', any: ['merci'] },
          { label: 'say goodbye', any: ['au revoir', 'bonne journée', 'bonne fin de journée'] },
        ],
        models: ['Merci beaucoup, au revoir !'],
      },
    ],
    itemIds: [ga.annule.id, ga.suivant.id, ga.correspondance.id, ga.echanger.id, g.merci.id, g.aurevoir.id],
  },
  {
    id: 'fr.u8.talk.weekend',
    unitId: 'fr.u8',
    level: 'A2',
    title: 'Telling Hugo About Your Trip',
    place: 'A Café in Lyon',
    setting: "You're back from a weekend in Marseille. Hugo wants to hear all about it.",
    register: 'informal',
    partner: { name: 'Hugo', voice: 'b' },
    turns: [
      { kind: 'partner', target: "Salut ! Alors, Marseille, c'était comment ?", native: 'Hi! So, how was Marseille?' },
      {
        kind: 'learner',
        goal: 'Say it was brilliant and the weather was nice.',
        slots: [
          { label: 'say it was brilliant', any: ["c'était génial", "c'était super", 'génial', 'super'] },
          { label: 'say the weather was nice', any: ['il a fait beau', 'beau temps', 'du soleil'] },
        ],
        models: ["C'était génial ! Il a fait beau tout le week-end."],
      },
      { kind: 'partner', target: "Super ! Et qu'est-ce que tu as fait ?", native: 'Great! And what did you do?' },
      {
        kind: 'learner',
        goal: 'Say something you did, in the past.',
        slots: [{ label: 'say what you did', any: ["j'ai", 'on a', 'nous avons', 'je suis', 'on est', 'je me suis', "on s'est"] }],
        models: ["On s'est promenés sur le port et j'ai visité Notre-Dame-de-la-Garde."],
        tip: 'Use avoir for most verbs (j\'ai visité, on a mangé) and être for going and staying (je suis allé(e)).',
      },
      { kind: 'partner', target: "Et le voyage, ça s'est bien passé ?", native: 'And did the journey go well?' },
      {
        kind: 'learner',
        goal: 'Say the train was late, but you arrived on Saturday afternoon.',
        slots: [
          { label: 'say the train was late', any: ['en retard', 'de retard', 'du retard'] },
          { label: 'say when you arrived', any: ['arrivé(e)', 'arrivé(e)s'] },
        ],
        models: ['Le train a eu du retard, mais je suis arrivée samedi après-midi.', 'Le train était en retard, mais on est arrivés samedi après-midi.'],
      },
      { kind: 'partner', target: 'Ah, les trains ! Bon, on se voit demain ?', native: 'Ah, trains! Right, see you tomorrow?' },
      {
        kind: 'learner',
        goal: 'Say yes, see you tomorrow.',
        slots: [
          { label: 'agree', any: ['oui', "d'accord", 'ok'] },
          { label: 'say see you tomorrow', any: ['à demain'] },
        ],
        models: ['Oui, à demain !'],
      },
    ],
    itemIds: [ra.cetaitgenial.id, ra.ilafaitbeau.id, ra.onsestpromenes.id, ga.enretard.id, pc.suisarrive.id, w.ademain.id],
  },
]
