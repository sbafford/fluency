import type { Conversation, ListeningPiece } from '../../engine/types'
import { unit6Items } from './unit6'
import { unit7Items } from './unit7'
import { unit11Items } from './unit11'

const { f } = unit6Items
const { n: past } = unit7Items
const { t, tel, pr, em } = unit11Items

/*
 * Unit 11 listening and conversations: a voicemail that moves a meeting, two
 * colleagues sharing out tasks, phoning a studio and a quick catch-up with
 * Thomas about who is doing what.
 */

export const listening11: ListeningPiece[] = [
  {
    id: 'fr.u11.listen.voicemail',
    unitId: 'fr.u11',
    level: 'A2',
    title: 'Un message de Monsieur Martin',
    kind: 'monologue',
    setting: 'Monsieur Martin from Studio Lumière leaves Sarah a voicemail.',
    speakers: { martin: { name: 'M. Martin', voice: 'b' } },
    lines: [
      { speaker: 'martin', target: 'Bonjour Madame Wilson, ici Monsieur Martin, du Studio Lumière.', native: 'Hello Madame Wilson, this is Monsieur Martin, from Studio Lumière.' },
      { speaker: 'martin', target: 'Je vous rappelle pour la réunion de jeudi.', native: "I'm calling you back about Thursday's meeting." },
      { speaker: 'martin', target: 'Désolé, jeudi, je ne suis pas disponible : je suis à Paris toute la journée.', native: "Sorry, on Thursday I'm not available: I'm in Paris all day." },
      { speaker: 'martin', target: 'Vendredi à quatorze heures, ça vous va ?', native: 'Friday at two in the afternoon, does that suit you?' },
      { speaker: 'martin', target: 'Je vous envoie le programme par e-mail ce soir.', native: "I'll send you the programme by e-mail this evening." },
      { speaker: 'martin', target: 'Vous pouvez me rappeler au zéro quatre, soixante-dix-huit, douze, trente-quatre, cinquante-six. Merci, et bonne journée !', native: 'You can call me back on 04 78 12 34 56. Thanks, and have a good day!' },
    ],
    questions: [
      { id: 'q1', question: 'Why is Monsieur Martin calling?', options: ["He can't come on Thursday", 'He wants to cancel the project', 'He has sent the programme', 'He is lost in Lyon'], answers: ["He can't come on Thursday"] },
      { id: 'q2', question: 'Where will he be on Thursday?', options: ['Paris', 'Lyon', 'Marseille', 'At the museum'], answers: ['Paris'] },
      { id: 'q3', question: 'What new time does he suggest?', options: ['Friday at 2 pm', 'Friday at 10 am', 'Thursday at 2 pm', 'Monday at 4 pm'], answers: ['Friday at 2 pm'] },
      {
        id: 'q4',
        question: 'What is he sending this evening? Type the answer in English.',
        answers: ['the programme', 'programme', 'the program', 'program', 'the schedule', 'the agenda', 'le programme'],
        answerLang: 'native',
      },
    ],
    itemIds: [em.disponible.id, em.bonnejournee.id, t.reunion.id, pr.envoyer.id],
  },
  {
    id: 'fr.u11.listen.tasks',
    unitId: 'fr.u11',
    level: 'A2',
    title: 'Qui fait quoi ?',
    kind: 'dialogue',
    setting: "Chloé and Thomas share out the morning's tasks at the office.",
    speakers: { chloe: { name: 'Chloé', voice: 'a' }, thomas: { name: 'Thomas', voice: 'b' } },
    lines: [
      { speaker: 'chloe', target: 'Thomas, tu as le dossier du musée ?', native: 'Thomas, have you got the museum file?' },
      { speaker: 'thomas', target: 'Oui, je le lis maintenant.', native: "Yes, I'm reading it now." },
      { speaker: 'chloe', target: 'Et les photos ? Nathalie les veut avant midi.', native: 'And the photos? Nathalie wants them before midday.' },
      { speaker: 'thomas', target: 'Pas de problème, je les envoie tout de suite.', native: "No problem, I'll send them right away." },
      { speaker: 'chloe', target: 'Et le client de Grenoble ? Tu lui as téléphoné ?', native: 'And the client in Grenoble? Have you phoned him?' },
      { speaker: 'thomas', target: "Pas encore. Je vais l'appeler après la réunion.", native: "Not yet. I'm going to call him after the meeting." },
      { speaker: 'chloe', target: 'Parfait. Moi, demain, je suis en télétravail, mais je suis disponible au téléphone.', native: "Perfect. I'm working from home tomorrow, but I'm available on the phone." },
    ],
    questions: [
      { id: 'q1', question: 'What is Thomas doing with the file?', options: ['Reading it', 'Sending it', 'Looking for it', 'Printing it'], answers: ['Reading it'] },
      { id: 'q2', question: 'When does Nathalie want the photos?', options: ['Before midday', 'This evening', 'Tomorrow', 'After the meeting'], answers: ['Before midday'] },
      { id: 'q3', question: 'Has Thomas phoned the client?', options: ['Not yet', 'Yes, this morning', 'Yes, yesterday'], answers: ['Not yet'] },
      { id: 'q4', question: 'What is Chloé doing tomorrow?', options: ['Working from home', 'Going to Grenoble', 'Taking a day off', 'Meeting the client'], answers: ['Working from home'] },
    ],
    itemIds: [pr.dossier.id, pr.le.id, pr.les.id, pr.toutdesuite.id, pr.vaislappeler.id, t.teletravail.id, em.disponible.id, past.pasencore.id],
  },
]

export const conversations11: Conversation[] = [
  {
    id: 'fr.u11.talk.phone',
    unitId: 'fr.u11',
    level: 'A2',
    title: 'Calling the Studio',
    place: 'On the Phone',
    setting: 'You phone Studio Lumière to speak to Monsieur Martin about the museum project.',
    register: 'formal',
    partner: { name: 'La réceptionniste', voice: 'a' },
    turns: [
      { kind: 'partner', target: 'Studio Lumière, bonjour !', native: 'Studio Lumière, good morning!' },
      {
        kind: 'learner',
        goal: 'Say hello and ask to speak to Monsieur Martin.',
        slots: [
          { label: 'say hello', any: ['bonjour', 'bonsoir'] },
          { label: 'ask to speak to him', any: ['je voudrais parler à', 'je peux parler à', 'est-ce que je peux parler à', 'pourrais-je parler à'] },
        ],
        models: ["Bonjour, je voudrais parler à Monsieur Martin, s'il vous plaît."],
      },
      { kind: 'partner', target: "C'est de la part de qui ?", native: "Who's calling?" },
      {
        kind: 'learner',
        goal: 'Give your name.',
        slots: [{ label: 'give your name', any: ["c'est", 'de la part de', 'je suis', "je m'appelle", 'ici'] }],
        models: ['De la part de {name}.', "C'est {name}, de l'agence Rhône Com."],
      },
      { kind: 'partner', target: 'Ne quittez pas… Désolée, il est en réunion. Vous voulez laisser un message ?', native: "Hold the line… Sorry, he's in a meeting. Would you like to leave a message?" },
      {
        kind: 'learner',
        goal: 'Say yes, and ask if he can call you back.',
        slots: [
          { label: 'say yes', any: ['oui', "d'accord"] },
          { label: 'ask him to call back', any: ['rappeler'] },
        ],
        models: ["Oui, il peut me rappeler, s'il vous plaît ?", 'Oui. Pourriez-vous lui demander de me rappeler ?'],
        tip: 'Rappeler is to call back: il peut me rappeler ?',
      },
      { kind: 'partner', target: 'Bien sûr. Votre numéro, s\'il vous plaît ?', native: 'Of course. Your number, please?' },
      {
        kind: 'learner',
        goal: 'Give a mobile number, starting with zéro six.',
        slots: [{ label: 'give a number', any: ['zéro six', 'zéro sept', '06', '07', 'mon numéro'] }],
        models: ["C'est le 06 12 34 56 78.", "Mon numéro, c'est le zéro six, douze, trente-quatre, cinquante-six, soixante-dix-huit."],
        tip: 'French numbers are read in pairs.',
      },
      { kind: 'partner', target: 'Merci, je lui donne le message. Bonne journée !', native: "Thanks, I'll give him the message. Have a good day!" },
      {
        kind: 'learner',
        goal: 'Thank her and say goodbye.',
        slots: [
          { label: 'thank her', any: ['merci', 'je vous remercie'] },
          { label: 'say goodbye', any: ['au revoir', 'bonne journée', 'à bientôt'] },
        ],
        models: ['Merci beaucoup, au revoir !', 'Je vous remercie. Bonne journée !'],
      },
    ],
    itemIds: [tel.parlera.id, tel.delapart.id, tel.nequittezpas.id, tel.enreunion.id, tel.message.id, f.telephone.id, em.bonnejournee.id],
  },
  {
    id: 'fr.u11.talk.tasks',
    unitId: 'fr.u11',
    level: 'A2',
    title: 'Who Does What?',
    place: 'The Office',
    setting: 'Thomas checks where you are with the museum project. Answer with le, la, l\' or leur instead of repeating the nouns.',
    register: 'informal',
    partner: { name: 'Thomas', voice: 'b' },
    turns: [
      { kind: 'partner', target: 'Le rapport, tu le finis quand ?', native: 'The report, when are you finishing it?' },
      {
        kind: 'learner',
        goal: 'Say when you are finishing it, using le.',
        slots: [
          { label: 'use le for the report', any: ['je le', 'vais le'] },
          { label: 'say when', any: ['ce soir', 'demain', 'tout de suite', 'cet après-midi', 'maintenant', 'lundi', 'vendredi'] },
        ],
        models: ['Je le finis ce soir.', 'Je vais le finir demain.'],
      },
      { kind: 'partner', target: 'Et la présentation ? Tu la prépares avec Chloé ?', native: 'And the presentation? Are you preparing it with Chloé?' },
      {
        kind: 'learner',
        goal: 'Say yes, you are preparing it with her tomorrow.',
        slots: [
          { label: 'use la for the presentation', any: ['je la', 'on la', 'vais la', 'nous la'] },
          { label: 'say when', any: ['demain', 'ce soir', 'cet après-midi', 'lundi', 'jeudi', 'vendredi'] },
        ],
        models: ['Oui, je la prépare avec elle demain.', 'Oui, on la prépare demain matin.'],
      },
      { kind: 'partner', target: 'Tu as appelé Madame Roux ?', native: 'Have you called Madame Roux?' },
      {
        kind: 'learner',
        goal: "Say not yet: you're going to call her right away.",
        slots: [
          { label: 'say not yet', any: ['pas encore', 'non'] },
          { label: "use l' with appeler", any: ["je vais l'appeler", "je l'appelle"] },
        ],
        models: ["Pas encore. Je vais l'appeler tout de suite.", "Non, pas encore, je l'appelle maintenant."],
        tip: "Appeler has no à, so it is je l'appelle, not je lui appelle.",
      },
      { kind: 'partner', target: 'Et les clients ? Tu leur écris ?', native: 'And the clients? Are you writing to them?' },
      {
        kind: 'learner',
        goal: 'Say yes, you are writing to them this afternoon.',
        slots: [
          { label: 'use leur for the clients', any: ['je leur', 'vais leur'] },
          { label: 'say when', any: ['cet après-midi', 'ce soir', 'demain', 'tout de suite', 'maintenant'] },
        ],
        models: ['Oui, je leur écris cet après-midi.', 'Oui, je vais leur écrire ce soir.'],
      },
      { kind: 'partner', target: 'Super, merci ! On fait une belle équipe.', native: 'Great, thanks! We make a good team.' },
    ],
    itemIds: [pr.le.id, pr.la.id, pr.lapos.id, pr.leur.id, pr.vaislappeler.id, pr.toutdesuite.id, past.pasencore.id],
  },
]
