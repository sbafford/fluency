import type { Conversation, ListeningPiece } from '../../engine/types'
import { unit1Items } from './unit1'
import { unit2Items } from './unit2'
import { unit6Items } from './unit6'

const { g } = unit1Items
const { h, w } = unit2Items
const { m, p, f } = unit6Items

/*
 * Unit 6 listening and conversations: a weekend forecast, a voicemail that
 * changes plans, signing up at a gym and saying goodbye to Léa.
 */

export const listening6: ListeningPiece[] = [
  {
    id: 'fr.u6.listen.forecast',
    unitId: 'fr.u6',
    level: 'A1',
    title: 'La météo du week-end',
    kind: 'announcement',
    setting: 'The weekend forecast on a Lyon radio station.',
    speakers: { radio: { name: 'La radio', voice: 'a' } },
    lines: [
      { speaker: 'radio', target: 'Bonjour à tous, voici la météo du week-end.', native: "Hello everyone, here is the weekend's weather." },
      { speaker: 'radio', target: 'Samedi matin, il pleut à Lyon, et il fait froid : huit degrés.', native: "On Saturday morning, it's raining in Lyon, and it's cold: eight degrees." },
      { speaker: 'radio', target: "Samedi après-midi, il y a du vent, mais il ne pleut pas.", native: "On Saturday afternoon, it's windy, but it isn't raining." },
      { speaker: 'radio', target: 'Dimanche, il fait beau ! Il y a du soleil et il fait quinze degrés.', native: "On Sunday, the weather is nice! It's sunny and fifteen degrees." },
      { speaker: 'radio', target: 'Dans les Alpes, il neige. Bon week-end !', native: "In the Alps, it's snowing. Have a good weekend!" },
    ],
    questions: [
      { id: 'q1', question: "What's the weather on Saturday morning?", options: ['Rain', 'Sun', 'Snow', 'Wind'], answers: ['Rain'] },
      { id: 'q2', question: "What's the temperature on Saturday morning?", options: ['8 °C', '18 °C', '15 °C', '5 °C'], answers: ['8 °C'] },
      { id: 'q3', question: 'Which is the best time for a picnic?', options: ['Sunday', 'Saturday morning', 'Saturday afternoon'], answers: ['Sunday'] },
      { id: 'q4', question: "Where is it snowing? Type the answer in English.", answers: ['the Alps', 'Alps', 'in the Alps', 'les Alpes'], answerLang: 'native' },
    ],
    itemIds: [m.pleut.id, m.froid.id, m.vent.id, m.beau.id, m.soleil.id, m.degres.id, m.neige.id, w.weekend.id],
  },
  {
    id: 'fr.u6.listen.voicemail',
    unitId: 'fr.u6',
    level: 'A1',
    title: 'Un message vocal',
    kind: 'monologue',
    setting: 'Hugo leaves Sarah a voicemail about tonight.',
    speakers: { hugo: { name: 'Hugo', voice: 'b' } },
    lines: [
      { speaker: 'hugo', target: "Salut Sarah, c'est Hugo !", native: "Hi Sarah, it's Hugo!" },
      { speaker: 'hugo', target: 'Je suis désolé, je ne peux pas venir au cinéma ce soir. Je travaille tard.', native: "I'm sorry, I can't come to the cinema tonight. I'm working late." },
      { speaker: 'hugo', target: 'On se voit demain ? Je finis à six heures.', native: 'Shall we meet up tomorrow? I finish at six.' },
      { speaker: 'hugo', target: 'On mange ensemble à sept heures et demie ?', native: 'Shall we eat together at half past seven?' },
      { speaker: 'hugo', target: 'Envoie-moi un texto. À plus !', native: 'Send me a text. See you later!' },
    ],
    questions: [
      {
        id: 'q1',
        question: 'Why is Hugo calling?',
        options: ["He can't come tonight", "He's running late for the cinema", 'He wants to go to the cinema tomorrow morning'],
        answers: ["He can't come tonight"],
      },
      { id: 'q2', question: 'When does he suggest meeting?', options: ['Tomorrow', 'Tonight', 'Saturday', 'Sunday'], answers: ['Tomorrow'] },
      { id: 'q3', question: 'What time does he suggest eating?', options: ['7:30', '6:00', '6:30', '7:00'], answers: ['7:30'] },
      { id: 'q4', question: 'How does he sign off? Type it in French.', answers: ['à plus', 'à plus tard', 'a+'], answerLang: 'target' },
    ],
    itemIds: [p.desole.id, p.jenepeuxpas.id, p.onsevoit.id, p.aplus.id, w.demain.id, h.etdemie.id],
  },
]

export const conversations6: Conversation[] = [
  {
    id: 'fr.u6.talk.gym',
    unitId: 'fr.u6',
    level: 'A1',
    title: 'Joining a Gym',
    place: 'The Gym Front Desk',
    setting: "You're signing up at a gym. The receptionist fills in the form with you.",
    register: 'formal',
    partner: { name: 'Le réceptionniste', voice: 'b', pitch: 0.85 },
    turns: [
      {
        kind: 'partner',
        target: "Bonjour ! Pour l'inscription, votre nom et votre prénom, s'il vous plaît.",
        native: 'Hello! To sign up, your surname and first name, please.',
      },
      {
        kind: 'learner',
        goal: 'Give your name.',
        slots: [{ label: 'give your name', any: ["je m'appelle", 'je suis', "c'est", 'mon nom', 'mon prénom'] }],
        models: ["Je m'appelle {name}."],
      },
      { kind: 'partner', target: 'Merci. Votre adresse e-mail ?', native: 'Thank you. Your e-mail address?' },
      {
        kind: 'learner',
        goal: 'Give an e-mail address, saying the @ and the dot in French.',
        slots: [
          { label: 'say the @', any: ['arobase'] },
          { label: 'say the dot', any: ['point'] },
        ],
        models: ['{name} arobase mail point com.'],
        tip: 'Say @ as arobase and the dot as point.',
      },
      { kind: 'partner', target: 'Et votre numéro de téléphone ?', native: 'And your phone number?' },
      {
        kind: 'learner',
        goal: 'Give a French mobile number, starting with zéro six.',
        slots: [{ label: 'start with zéro six', any: ['zéro six', '06'] }],
        models: ['Zéro six, douze, trente-quatre, cinquante, vingt.'],
        tip: 'French mobile numbers start with 06 or 07 and are read in pairs.',
      },
      { kind: 'partner', target: 'Parfait. Et votre profession ?', native: 'Perfect. And your occupation?' },
      {
        kind: 'learner',
        goal: 'Say what you do.',
        slots: [{ label: 'say what you do', any: ['je travaille', 'je suis'] }],
        models: ['Je travaille dans la communication.', 'Je suis étudiante.'],
      },
      { kind: 'partner', target: "Très bien. Une signature ici, s'il vous plaît. Bienvenue !", native: 'Very good. A signature here, please. Welcome!' },
      {
        kind: 'learner',
        goal: 'Thank him and say goodbye.',
        slots: [
          { label: 'thank him', any: ['merci'] },
          { label: 'say goodbye', any: ['au revoir', 'bonne journée', 'bonne soirée', 'à bientôt'] },
        ],
        models: ['Merci, au revoir !'],
      },
    ],
    itemIds: [f.nom.id, f.prenom.id, f.email.id, f.arobase.id, f.point.id, f.telephone.id, f.profession.id, g.merci.id, g.aurevoir.id],
  },
  {
    id: 'fr.u6.talk.goodbye',
    unitId: 'fr.u6',
    level: 'A1',
    title: 'Saying Goodbye to Léa',
    place: 'Messages With Léa',
    setting: 'Your time in Lyon is nearly over. Léa messages you.',
    register: 'informal',
    partner: { name: 'Léa', voice: 'a' },
    turns: [
      {
        kind: 'partner',
        target: 'Coucou ! Tu es libre demain soir ? On fait un dîner pour toi !',
        native: "Hi! Are you free tomorrow evening? We're having a dinner for you!",
      },
      {
        kind: 'learner',
        goal: "Say sorry, say you can't come tomorrow, and suggest Saturday.",
        slots: [
          { label: 'say sorry', any: ['désolé(e)', 'pardon'] },
          { label: "say you can't", any: ['je ne peux pas', 'je peux pas'] },
          { label: 'suggest Saturday', any: ['samedi'] },
        ],
        models: ['Désolée, je ne peux pas venir demain. On se voit samedi ?', 'Désolé, je ne peux pas demain. Samedi ?'],
      },
      { kind: 'partner', target: "Samedi, c'est parfait ! Quel temps fait-il samedi ? On mange dehors ?", native: "Saturday's perfect! What's the weather like on Saturday? Shall we eat outside?" },
      {
        kind: 'learner',
        goal: "Say yes: on Saturday the weather is nice and it's sunny.",
        slots: [
          { label: "say it's nice weather", any: ['il fait beau', 'il va faire beau', 'beau temps'] },
          { label: "say it's sunny", any: ['il y a du soleil', 'soleil'] },
        ],
        models: ['Oui, samedi, il fait beau et il y a du soleil !'],
      },
      { kind: 'partner', target: "Super ! Merci pour cette semaine, c'était génial.", native: 'Great! Thanks for this week, it was brilliant.' },
      {
        kind: 'learner',
        goal: 'Thank her for everything and sign off as a friend.',
        slots: [
          { label: 'thank her', any: ['merci'] },
          { label: 'sign off as a friend', any: ['bisous', 'grosses bises', 'bises', 'à plus', 'à samedi'] },
        ],
        models: ['Merci pour tout, Léa ! À samedi, bisous !'],
        tip: 'Merci pour tout means "thank you for everything".',
      },
    ],
    itemIds: [p.coucou.id, p.desole.id, p.jenepeuxpas.id, p.onsevoit.id, m.queltemps.id, m.beau.id, m.soleil.id, p.mercipour.id, p.bisous.id, w.samedi.id],
  },
]
