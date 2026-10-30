import type { Conversation, ListeningPiece } from '../../engine/types'
import { unit10Items } from './unit10'

const { h, d, c, m } = unit10Items

/*
 * Unit 10 listening and conversations: Mamie remembers the Fête des Lumières,
 * Thomas shows Chloé an old class photo, Sunday lunch with Mamie, and Hugo
 * and Sarah remember the day they met.
 */

export const listening10: ListeningPiece[] = [
  {
    id: 'fr.u10.listen.lumieres',
    unitId: 'fr.u10',
    level: 'A2',
    title: 'Le souvenir de Mamie',
    kind: 'monologue',
    setting: "After lunch, Léa's grandmother remembers the 8th of December when she was a child.",
    speakers: { mamie: { name: 'Mamie', voice: 'a' } },
    lines: [
      { speaker: 'mamie', target: "Quand j'étais petite, j'habitais dans le Vieux Lyon, avec mes parents et mes deux frères.", native: 'When I was little, I lived in Vieux Lyon, with my parents and my two brothers.' },
      { speaker: 'mamie', target: 'Tous les ans, le huit décembre, on mettait des bougies aux fenêtres.', native: 'Every year, on the eighth of December, we put candles in the windows.' },
      { speaker: 'mamie', target: "Il faisait très froid, mais c'était magique.", native: 'It was very cold, but it was magical.' },
      { speaker: 'mamie', target: 'Une année, il a neigé ce soir-là. Mon petit frère est tombé dans la neige, et on a beaucoup ri !', native: 'One year, it snowed that evening. My little brother fell over in the snow, and we laughed a lot!' },
      { speaker: 'mamie', target: "Maintenant, il y a plus de monde et plus de lumières, mais moi, je préfère les bougies d'avant.", native: 'Now there are more people and more lights, but I prefer the candles of the old days.' },
    ],
    questions: [
      { id: 'q1', question: 'Where did Mamie live as a child?', options: ['In Vieux Lyon', 'In Villeurbanne', 'In the countryside', 'In Paris'], answers: ['In Vieux Lyon'] },
      { id: 'q2', question: 'What did her family put in the windows?', options: ['Candles', 'Flowers', 'Flags', 'Paper stars'], answers: ['Candles'] },
      {
        id: 'q3',
        question: 'What happened one year?',
        options: ['It snowed and her little brother fell over', 'It rained all evening', 'She got lost in the crowd', 'The candles went out'],
        answers: ['It snowed and her little brother fell over'],
      },
      {
        id: 'q4',
        question: "What does she prefer: today's lights or the candles of the old days? Type the answer in English.",
        answers: ['the candles', 'candles', 'the old candles', 'the candles of the old days', 'the candles from before', 'candles from before'],
        answerLang: 'native',
      },
    ],
    itemIds: [h.quandjetaispetite.id, h.jhabitais.id, d.cetait.id, c.plusde.id, c.maintenant.id, c.avant.id],
  },
  {
    id: 'fr.u10.listen.photo',
    unitId: 'fr.u10',
    level: 'A2',
    title: 'La photo de classe',
    kind: 'dialogue',
    setting: 'At lunch, Thomas shows Chloé an old class photo from primary school.',
    speakers: { chloe: { name: 'Chloé', voice: 'a' }, thomas: { name: 'Thomas', voice: 'b' } },
    lines: [
      { speaker: 'chloe', target: "C'est toi, le petit garçon avec les lunettes ?", native: "Is that you, the little boy with the glasses?" },
      { speaker: 'thomas', target: "Oui ! J'avais huit ans. J'étais très timide.", native: 'Yes! I was eight. I was very shy.' },
      { speaker: 'chloe', target: 'Timide, toi ? Maintenant, tu parles plus que tout le monde !', native: 'You, shy? Now you talk more than anyone!' },
      { speaker: 'thomas', target: "C'est vrai ! Et à l'époque, j'avais les cheveux longs.", native: 'True! And back then, I had long hair.' },
      { speaker: 'chloe', target: "Et l'école, c'était où ?", native: 'And where was the school?' },
      { speaker: 'thomas', target: 'À la Croix-Rousse. Il y avait seulement deux classes, et la maîtresse était très gentille.', native: 'In the Croix-Rousse. There were only two classes, and the teacher was very kind.' },
      { speaker: 'chloe', target: "Moi, je n'aimais pas l'école. Je préférais le sport !", native: "I didn't like school. I preferred sport!" },
    ],
    questions: [
      { id: 'q1', question: 'How old was Thomas in the photo?', options: ['Eight', 'Ten', 'Six', 'Twelve'], answers: ['Eight'] },
      { id: 'q2', question: 'What was he like back then?', options: ['Shy', 'Chatty', 'Funny', 'Naughty'], answers: ['Shy'] },
      { id: 'q3', question: 'Where was his school?', options: ['La Croix-Rousse', 'Confluence', 'Villeurbanne', 'Fourvière'], answers: ['La Croix-Rousse'] },
      { id: 'q4', question: 'What did Chloé prefer to school? Type the answer in English.', answers: ['sport', 'sports', 'doing sport', 'pe'], answerLang: 'native' },
    ],
    itemIds: [d.javais.id, d.iletait.id, d.ilyavait.id, c.maintenant.id, h.jaimais.id],
  },
]

export const conversations10: Conversation[] = [
  {
    id: 'fr.u10.talk.mamie',
    unitId: 'fr.u10',
    level: 'A2',
    title: 'Sunday Lunch With Mamie',
    place: "Léa's Grandmother's Flat",
    setting: "Léa's grandmother wants to hear about your childhood. She uses vous, so you do too.",
    register: 'formal',
    partner: { name: 'Mamie', voice: 'a' },
    turns: [
      { kind: 'partner', target: 'Alors, vous avez grandi où ?', native: 'So, where did you grow up?' },
      {
        kind: 'learner',
        goal: 'Say that when you were little, you lived in Perth.',
        slots: [
          { label: 'say when you were little', any: ["quand j'étais petite", "quand j'étais petit"] },
          { label: 'say where you lived', any: ["j'habitais"] },
        ],
        models: ["Quand j'étais petite, j'habitais à Perth."],
      },
      { kind: 'partner', target: "Et c'était comment, Perth ?", native: 'And what was Perth like?' },
      {
        kind: 'learner',
        goal: 'Say it was hot and there was a beach.',
        slots: [
          { label: 'describe the weather', any: ['il faisait'] },
          { label: 'say there was a beach', any: ['il y avait'] },
        ],
        models: ['Il faisait chaud et il y avait une belle plage.'],
      },
      { kind: 'partner', target: "Et qu'est-ce que vous faisiez le dimanche ?", native: 'And what did you do on Sundays?' },
      {
        kind: 'learner',
        goal: 'Say what you used to do on Sundays.',
        slots: [{ label: 'say what you used to do', any: ['on allait', "j'allais", 'je faisais', 'on faisait', 'je jouais', 'on jouait', 'on mangeait'] }],
        models: ['Le dimanche, on allait à la plage.', 'Le dimanche, je jouais avec mon frère.'],
        tip: 'For habits, use the imparfait: on allait, je faisais.',
      },
      { kind: 'partner', target: 'Et maintenant, vous préférez Lyon ou Perth ?', native: 'And now, do you prefer Lyon or Perth?' },
      {
        kind: 'learner',
        goal: 'Compare the two cities.',
        slots: [{ label: 'compare them', any: ['plus', 'moins', 'aussi', 'meilleur', 'meilleure', 'mieux'] }],
        models: ["À Lyon, il fait moins chaud qu'à Perth, mais le pain est meilleur !"],
      },
    ],
    itemIds: [h.quandjetaispetite.id, h.jhabitais.id, d.ilfaisait.id, d.ilyavait.id, h.onallait.id, h.ledimanche.id, c.meilleur.id],
  },
  {
    id: 'fr.u10.talk.firstday',
    unitId: 'fr.u10',
    level: 'A2',
    title: 'The Day We Met',
    place: 'A Café in the Croix-Rousse',
    setting: 'Hugo remembers the day you met at the conference, a year ago.',
    register: 'informal',
    partner: { name: 'Hugo', voice: 'b' },
    turns: [
      { kind: 'partner', target: 'Tu te souviens de ton premier jour à Lyon ?', native: 'Do you remember your first day in Lyon?' },
      {
        kind: 'learner',
        goal: 'Say yes: it was at the conference.',
        slots: [
          { label: 'say yes', any: ['oui', 'bien sûr'] },
          { label: 'say it was at the conference', any: ["c'était"] },
        ],
        models: ["Oui ! C'était à la conférence."],
      },
      { kind: 'partner', target: 'Il faisait quel temps ?', native: 'What was the weather like?' },
      {
        kind: 'learner',
        goal: 'Say it was raining when you arrived.',
        slots: [
          { label: 'say it was raining', any: ['il pleuvait'] },
          { label: 'say when you arrived', any: ['quand je suis arrivée', 'quand je suis arrivé'] },
        ],
        models: ['Il pleuvait quand je suis arrivée.'],
        tip: 'Imparfait for the scene, passé composé for the moment you arrived.',
      },
      { kind: 'partner', target: "Et moi, j'avais un grand parapluie !", native: 'And I had a big umbrella!' },
      {
        kind: 'learner',
        goal: 'Say that while you were looking for your badge, he arrived.',
        slots: [
          { label: 'say while', any: ['pendant que'] },
          { label: 'say he arrived', any: ['tu es arrivé'] },
        ],
        models: ['Oui ! Pendant que je cherchais mon badge, tu es arrivé.'],
      },
      { kind: 'partner', target: "Et après, on a pris un café. C'était sympa !", native: 'And after that, we had a coffee. It was nice!' },
      {
        kind: 'learner',
        goal: 'Say it was the first time you had a coffee in Lyon.',
        slots: [{ label: 'say it was the first time', any: ['la première fois'] }],
        models: ["C'était la première fois que je buvais un café à Lyon !"],
      },
    ],
    itemIds: [d.cetait.id, m.quandjesuisarrivee.id, m.pendantque.id, m.jecherchais.id, m.lapremierefois.id],
  },
]
