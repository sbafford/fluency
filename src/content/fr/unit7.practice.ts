import type { Conversation, ListeningPiece } from '../../engine/types'
import { unit6Items } from './unit6'
import { unit7Items } from './unit7'

const { r, p } = unit6Items
const { a, i, n, s } = unit7Items

/*
 * Unit 7 listening and conversations: Léa's voicemail about her trip to
 * Annecy, two colleagues at the coffee machine, Monday small talk at work and
 * a message to Léa about a party she missed.
 */

export const listening7: ListeningPiece[] = [
  {
    id: 'fr.u7.listen.annecy',
    unitId: 'fr.u7',
    level: 'A2',
    title: 'Le week-end de Léa',
    kind: 'monologue',
    setting: 'Léa leaves Sarah a voicemail on Sunday evening.',
    speakers: { lea: { name: 'Léa', voice: 'a' } },
    lines: [
      { speaker: 'lea', target: "Salut Sarah, c'est Léa ! Tu as passé un bon week-end ?", native: "Hi Sarah, it's Léa! Did you have a good weekend?" },
      { speaker: 'lea', target: "Moi, samedi, j'ai pris le train pour Annecy avec ma sœur.", native: 'On Saturday, I took the train to Annecy with my sister.' },
      { speaker: 'lea', target: "On a marché autour du lac pendant trois heures, et on a mangé une tartiflette. C'était génial !", native: 'We walked round the lake for three hours, and we ate a tartiflette. It was brilliant!' },
      { speaker: 'lea', target: "Dimanche, j'ai dormi jusqu'à onze heures, et après, j'ai lu.", native: 'On Sunday, I slept until eleven, and afterwards, I read.' },
      { speaker: 'lea', target: 'Rappelle-moi ce soir ! Bisous.', native: 'Call me back this evening! Love,' },
    ],
    questions: [
      { id: 'q1', question: 'Where did Léa go on Saturday?', options: ['Annecy', 'Paris', 'Grenoble', 'Marseille'], answers: ['Annecy'] },
      { id: 'q2', question: 'Who did she go with?', options: ['Her sister', 'Hugo', 'Her mother', 'Sarah'], answers: ['Her sister'] },
      { id: 'q3', question: 'How long did they walk for?', options: ['Three hours', 'Two hours', 'Thirty minutes', 'All day'], answers: ['Three hours'] },
      { id: 'q4', question: 'What did she do on Sunday?', options: ['She slept late and read', 'She worked', 'She took the train home', 'She went walking again'], answers: ['She slept late and read'] },
    ],
    itemIds: [a.bonweekend.id, i.jaipris.id, s.pendant.id, s.cetaitgenial.id, i.jaidormi.id, i.jailu.id, s.apres.id],
  },
  {
    id: 'fr.u7.listen.office',
    unitId: 'fr.u7',
    level: 'A2',
    title: 'À la machine à café',
    kind: 'dialogue',
    setting: "Monday morning at Sarah's office. Two of her colleagues chat at the coffee machine.",
    speakers: { thomas: { name: 'Thomas', voice: 'b' }, chloe: { name: 'Chloé', voice: 'a' } },
    lines: [
      { speaker: 'thomas', target: 'Salut Chloé ! Tu as passé un bon week-end ?', native: 'Hi Chloé! Did you have a good weekend?' },
      { speaker: 'chloe', target: "Bof… Samedi, j'ai travaillé, et dimanche, il a plu toute la journée.", native: 'Not really… On Saturday, I worked, and on Sunday, it rained all day.' },
      { speaker: 'thomas', target: "Oh non ! Tu as fait quoi, alors ?", native: 'Oh no! So what did you do?' },
      { speaker: 'chloe', target: "J'ai regardé trois films ! Et toi ?", native: 'I watched three films! And you?' },
      { speaker: 'thomas', target: "Moi, j'ai fait du vélo avec mes enfants au parc de la Tête d'Or.", native: "I went cycling with my children in the Parc de la Tête d'Or." },
      { speaker: 'thomas', target: "Et j'ai eu une surprise : mon fils a fait un gâteau pour mon anniversaire !", native: 'And I had a surprise: my son made a cake for my birthday!' },
      { speaker: 'chloe', target: "C'est trop mignon ! Joyeux anniversaire !", native: "That's so sweet! Happy birthday!" },
    ],
    questions: [
      { id: 'q1', question: "How was Chloé's weekend?", options: ['Not great', 'Brilliant', 'Busy with friends'], answers: ['Not great'] },
      { id: 'q2', question: 'What was the weather like on Sunday?', options: ['It rained', 'It was sunny', 'It snowed', 'It was windy'], answers: ['It rained'] },
      { id: 'q3', question: 'What did Thomas do?', options: ['He went cycling with his children', 'He watched films', 'He worked', 'He took the train'], answers: ['He went cycling with his children'] },
      {
        id: 'q4',
        question: "Why did Thomas's son make a cake? Type the answer in English.",
        answers: ['his birthday', 'for his birthday', "it was his birthday", "thomas's birthday", "for thomas's birthday", "it was thomas's birthday"],
        answerLang: 'native',
      },
    ],
    itemIds: [a.bonweekend.id, a.jairegarde.id, i.jaifait.id, i.jaieu.id, a.jaitravaille.id],
  },
]

export const conversations7: Conversation[] = [
  {
    id: 'fr.u7.talk.monday',
    unitId: 'fr.u7',
    level: 'A2',
    title: 'Monday at Work',
    place: 'The Coffee Machine',
    setting: 'Monday morning. Your colleague Thomas asks about your weekend.',
    register: 'informal',
    partner: { name: 'Thomas', voice: 'b' },
    turns: [
      { kind: 'partner', target: 'Salut ! Tu as passé un bon week-end ?', native: 'Hi! Did you have a good weekend?' },
      {
        kind: 'learner',
        goal: 'Say yes, you had a good weekend.',
        slots: [{ label: 'say yes', any: ['oui', 'super', 'très bien', "j'ai passé un bon week-end", "j'ai passé un très bon week-end"] }],
        models: ["Oui, j'ai passé un très bon week-end !", 'Oui, super, merci !'],
      },
      { kind: 'partner', target: "Qu'est-ce que tu as fait ?", native: 'What did you do?' },
      {
        kind: 'learner',
        goal: 'Say two things you did on Saturday.',
        slots: [
          { label: 'say what you did', any: ["j'ai", 'on a'] },
          { label: 'join two things', any: ['et', 'puis', 'ensuite', 'après'] },
        ],
        models: ["Samedi, j'ai fait du sport et j'ai vu des amis.", "J'ai lu, puis j'ai pris un café en ville."],
      },
      { kind: 'partner', target: "Et c'était comment ?", native: 'And how was it?' },
      {
        kind: 'learner',
        goal: 'Say how it was.',
        slots: [{ label: 'say how it was', any: ["c'était"] }],
        models: ["C'était génial !", "C'était sympa."],
      },
      { kind: 'partner', target: 'Et dimanche ? Tu as vu le match ?', native: 'And on Sunday? Did you see the match?' },
      {
        kind: 'learner',
        goal: "Say no, you didn't see it: you slept!",
        slots: [
          { label: "say you didn't see it", any: ["je n'ai pas vu", 'pas vu', 'non'] },
          { label: 'say you slept', any: ["j'ai dormi", 'dormi'] },
        ],
        models: ["Non, je n'ai pas vu le match. J'ai dormi !"],
        tip: "Ne and pas wrap around avoir: je n'ai pas vu.",
      },
    ],
    itemIds: [a.bonweekend.id, a.quastufait.id, s.jaipasse.id, s.cetaitgenial.id, n.nepasvu.id, i.jaidormi.id, i.jaifait.id],
  },
  {
    id: 'fr.u7.talk.party',
    unitId: 'fr.u7',
    level: 'A2',
    title: 'The Party Léa Missed',
    place: 'Messages With Léa',
    setting: 'Léa was ill and missed the party on Saturday. She messages you to find out how it went.',
    register: 'informal',
    partner: { name: 'Léa', voice: 'a' },
    turns: [
      {
        kind: 'partner',
        target: "Coucou ! Désolée pour samedi, j'ai été malade. C'était comment, la fête ?",
        native: 'Hi! Sorry about Saturday, I was ill. How was the party?',
      },
      {
        kind: 'learner',
        goal: 'Say it was brilliant.',
        slots: [{ label: 'say how it was', any: ["c'était"] }],
        models: ["C'était génial !"],
      },
      { kind: 'partner', target: "Raconte ! Qu'est-ce que vous avez fait ?", native: 'Tell me! What did you all do?' },
      {
        kind: 'learner',
        goal: 'Tell her in order: first you ate, then you danced.',
        slots: [
          { label: 'say first', any: ["d'abord"] },
          { label: 'say you ate', any: ['mangé'] },
          { label: 'say you danced', any: ['dansé'] },
        ],
        models: ["D'abord, on a mangé. Ensuite, on a dansé !", "D'abord, j'ai mangé, puis j'ai dansé."],
        tip: 'Danser is a regular -er verb: on a dansé.',
      },
      { kind: 'partner', target: 'Super ! Et tu as déjà vu le nouvel appartement de Hugo ?', native: "Great! And have you seen Hugo's new flat yet?" },
      {
        kind: 'learner',
        goal: 'Say not yet.',
        slots: [{ label: 'say not yet', any: ['pas encore'] }],
        models: ['Non, pas encore !', "Non, je n'ai pas encore vu son appartement."],
      },
      { kind: 'partner', target: 'On y va ensemble dimanche ? Bisous !', native: 'Shall we go together on Sunday? Love,' },
      {
        kind: 'learner',
        goal: 'Say yes and sign off as a friend.',
        slots: [
          { label: 'agree', any: ['oui', "d'accord", 'ok', 'super', 'avec plaisir'] },
          { label: 'sign off', any: ['bisous', 'bises', 'à dimanche', 'à plus'] },
        ],
        models: ["Oui, d'accord ! À dimanche, bisous !"],
      },
    ],
    itemIds: [s.cetaitgenial.id, s.raconte.id, r.dabord.id, n.deja.id, n.pasencore.id, p.bisous.id],
  },
]
