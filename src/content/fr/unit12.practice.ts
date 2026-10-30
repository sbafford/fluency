import type { Conversation, ListeningPiece } from '../../engine/types'
import { unit1Items } from './unit1'
import { unit12Items } from './unit12'

const { g } = unit1Items
const { iv, fe, fu } = unit12Items

/*
 * Unit 12 listening and conversations: Thomas's voicemail inviting Sarah to
 * his housewarming, a radio guide to the Fête des Lumières, accepting Léa's
 * galette invitation and the boss's end-of-year dinner.
 */

export const listening12: ListeningPiece[] = [
  {
    id: 'fr.u12.listen.cremaillere',
    unitId: 'fr.u12',
    level: 'A2',
    title: 'La crémaillère',
    kind: 'monologue',
    setting: 'Thomas leaves Sarah a voicemail about his new flat.',
    speakers: { thomas: { name: 'Thomas', voice: 'b' } },
    lines: [
      { speaker: 'thomas', target: "Salut Sarah, c'est Thomas !", native: "Hi Sarah, it's Thomas!" },
      { speaker: 'thomas', target: "J'ai un nouvel appartement à la Croix-Rousse, et je fais une petite fête samedi soir.", native: "I've got a new flat in the Croix-Rousse, and I'm having a little party on Saturday evening." },
      { speaker: 'thomas', target: 'Ça te dit de venir ? Ce sera vers vingt heures.', native: 'Do you fancy coming? It will be around eight in the evening.' },
      { speaker: 'thomas', target: "Chloé viendra aussi. S'il fait beau, on mangera sur le balcon.", native: "Chloé will come too. If the weather's nice, we'll eat on the balcony." },
      { speaker: 'thomas', target: "N'apporte rien, hein ! Juste ta bonne humeur.", native: "Don't bring anything, OK? Just bring your good mood." },
      { speaker: 'thomas', target: "Dis-moi si tu peux venir. À plus !", native: 'Let me know if you can come. See you!' },
    ],
    questions: [
      { id: 'q1', question: 'Why is Thomas having a party?', options: ["He's got a new flat", "It's his birthday", "It's Christmas", "He's got a new job"], answers: ["He's got a new flat"] },
      { id: 'q2', question: 'What time does it start?', options: ['Around 8 pm', 'Around 6 pm', 'At midnight', 'Around 10 pm'], answers: ['Around 8 pm'] },
      { id: 'q3', question: 'Where will they eat if the weather is nice?', options: ['On the balcony', 'In the park', 'At a restaurant', 'In the kitchen'], answers: ['On the balcony'] },
      { id: 'q4', question: 'Who else is coming? Type the name.', answers: ['Chloé', 'Chloe'], answerLang: 'target' },
    ],
    itemIds: [iv.catedit.id, fu.cesera.id, iv.vers.id, fu.sil.id, fu.onmangera.id, fu.tuviendras.id],
  },
  {
    id: 'fr.u12.listen.lumieres',
    unitId: 'fr.u12',
    level: 'A2',
    title: 'Ce soir, la Fête des Lumières',
    kind: 'announcement',
    setting: 'A Lyon radio station on the evening of 8 December.',
    speakers: { radio: { name: 'La radio', voice: 'a' } },
    lines: [
      { speaker: 'radio', target: "Bonsoir à tous ! Ce soir, c'est le 8 décembre, le grand soir de la Fête des Lumières.", native: "Good evening, everyone! Tonight it's 8 December, the big night of the Festival of Lights." },
      { speaker: 'radio', target: "N'oubliez pas : mettez vos bougies aux fenêtres à partir de dix-huit heures.", native: "Don't forget: put your candles in your windows from six o'clock." },
      { speaker: 'radio', target: 'Les spectacles de lumière commenceront à vingt heures, place des Terreaux et à Fourvière.', native: 'The light shows will begin at eight, on place des Terreaux and at Fourvière.' },
      { speaker: 'radio', target: 'Il y aura beaucoup de monde : prenez le métro, pas la voiture.', native: 'There will be lots of people: take the metro, not the car.' },
      { speaker: 'radio', target: 'Il fera froid, alors mettez un bon manteau. Bonne fête à tous !', native: "It will be cold, so wear a good coat. Enjoy the festival, everyone!" },
    ],
    questions: [
      { id: 'q1', question: 'What should people put in their windows?', options: ['Candles', 'Flowers', 'Flags', 'Christmas trees'], answers: ['Candles'] },
      { id: 'q2', question: 'When do the light shows begin?', options: ['At 8 pm', 'At 6 pm', 'At 10 pm', 'At midnight'], answers: ['At 8 pm'] },
      { id: 'q3', question: 'How should people travel?', options: ['By metro', 'By car', 'By bike', 'By taxi'], answers: ['By metro'] },
      { id: 'q4', question: 'What will the weather be like? Type it in English.', answers: ['cold', "it'll be cold", 'it will be cold'], answerLang: 'native' },
    ],
    itemIds: [fe.lumieres.id, fe.bougie.id, fu.cesera.id],
  },
]

export const conversations12: Conversation[] = [
  {
    id: 'fr.u12.talk.galette',
    unitId: 'fr.u12',
    level: 'A2',
    title: 'King Cake at Léa’s',
    place: 'A Message From Léa',
    setting: 'Léa phones to invite you for king cake on Sunday.',
    register: 'informal',
    partner: { name: 'Léa', voice: 'a' },
    turns: [
      { kind: 'partner', target: "Coucou ! Dimanche, on mange la galette des rois chez moi. Ça te dit ?", native: "Hi! On Sunday, we're eating king cake at my place. Do you fancy it?" },
      {
        kind: 'learner',
        goal: 'Accept warmly.',
        slots: [{ label: 'say yes', any: ['avec plaisir', 'volontiers', 'carrément', 'oui', 'super', 'génial', "d'accord", 'bonne idée'] }],
        models: ['Avec plaisir !', 'Carrément, super idée !'],
      },
      { kind: 'partner', target: 'Génial ! Tu viendras vers seize heures ?', native: 'Brilliant! Will you come around four?' },
      {
        kind: 'learner',
        goal: 'Say yes, that suits you, and ask where to meet or whether to come to her place.',
        slots: [
          { label: 'say it suits you', any: ['oui', "d'accord", 'ça me va', 'parfait', 'pas de problème', 'ok'] },
          { label: 'ask a question about meeting', any: ['où', 'chez toi', 'on se retrouve'] },
        ],
        models: ['Oui, ça me va. On se retrouve chez toi ?'],
      },
      { kind: 'partner', target: "Oui, chez moi. Et si tu as la fève, tu seras la reine !", native: "Yes, at my place. And if you get the charm, you'll be queen!" },
      {
        kind: 'learner',
        goal: 'React happily and say you will see her on Sunday.',
        slots: [{ label: 'say see you on Sunday', any: ['à dimanche', 'dimanche', 'à bientôt'] }],
        models: ['Super ! À dimanche !', "J'espère ! À dimanche, bisous !"],
      },
    ],
    itemIds: [iv.catedit.id, iv.avecplaisir.id, iv.onseretrouve.id, fe.galette.id, fu.tuviendras.id],
  },
  {
    id: 'fr.u12.talk.diner',
    unitId: 'fr.u12',
    level: 'A2',
    title: 'The End-of-Year Dinner',
    place: 'The Office',
    setting: "Your manager invites you to the team's end-of-year dinner.",
    register: 'formal',
    partner: { name: 'La cheffe', voice: 'a' },
    turns: [
      { kind: 'partner', target: "Bonjour ! Le 18 décembre, on fait le repas de fin d'année de l'équipe. Vous voulez venir ?", native: "Hello! On 18 December, we're having the team's end-of-year dinner. Would you like to come?" },
      {
        kind: 'learner',
        goal: 'Accept politely.',
        slots: [{ label: 'say yes', any: ['avec plaisir', 'volontiers', 'oui', "bien sûr", "d'accord"] }],
        models: ['Oui, avec plaisir !', 'Volontiers, merci !'],
      },
      { kind: 'partner', target: "Parfait. Ce sera au restaurant, à dix-neuf heures trente.", native: "Perfect. It will be at the restaurant, at half past seven." },
      {
        kind: 'learner',
        goal: 'Ask which restaurant, or where it is.',
        slots: [{ label: 'ask where', any: ['où', 'quel restaurant', 'c’est où', "c'est où"] }],
        models: ["C'est où ?", 'Dans quel restaurant ?'],
      },
      { kind: 'partner', target: "Au Petit Bouchon, dans le Vieux Lyon. Et après, on ira voir les illuminations.", native: "At the Petit Bouchon, in Old Lyon. And afterwards, we'll go and see the lights." },
      {
        kind: 'learner',
        goal: 'Say that sounds great and thank her.',
        slots: [
          { label: 'say it sounds good', any: ['super', 'génial', 'parfait', 'très bien', 'bonne idée', "c'est gentil"] },
          { label: 'thank her', any: ['merci'] },
        ],
        models: ['Très bien, merci beaucoup !', "C'est gentil, merci !"],
      },
    ],
    itemIds: [iv.tuveuxvenir.id, iv.avecplaisir.id, iv.volontiers.id, fu.cesera.id, g.merci.id],
  },
]
