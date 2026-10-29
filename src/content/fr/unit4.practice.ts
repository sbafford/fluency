import type { Conversation, ListeningPiece } from '../../engine/types'
import { unit2Items } from './unit2'
import { unit4Items } from './unit4'

const { w } = unit2Items
const { a, m, v, p } = unit4Items

/*
 * Unit 4 listening and role-plays: a market stall, a department store
 * announcement, buying picnic food and a lunchtime chat about likes.
 */

export const listening4: ListeningPiece[] = [
  {
    id: 'fr.u4.listen.stall',
    unitId: 'fr.u4',
    level: 'A1',
    title: 'Au stand de fruits',
    kind: 'dialogue',
    setting: 'A regular customer buys fruit at a Saturday market stall.',
    speakers: { mar: { name: 'Le marchand', voice: 'b', pitch: 0.85 }, roux: { name: 'Madame Roux', voice: 'a' } },
    lines: [
      { speaker: 'mar', target: "Bonjour, madame Roux ! Comme d'habitude ?", native: 'Hello, Mrs Roux! The usual?' },
      { speaker: 'roux', target: "Bonjour ! Oui, un kilo de pommes, s'il vous plaît.", native: 'Hello! Yes, a kilo of apples, please.' },
      { speaker: 'mar', target: 'Voilà. Et avec ceci ?', native: 'Here you are. Anything else?' },
      { speaker: 'roux', target: 'Elles sont belles, les fraises. Combien coûtent les fraises ?', native: 'The strawberries look lovely. How much are the strawberries?' },
      { speaker: 'mar', target: 'Quatre euros cinquante la barquette.', native: 'Four euros fifty a punnet.' },
      { speaker: 'roux', target: 'Je prends deux barquettes. Vous avez des cerises ?', native: "I'll take two punnets. Do you have any cherries?" },
      { speaker: 'mar', target: "Non, pas de cerises aujourd'hui. C'est trop tôt !", native: "No, no cherries today. It's too early!" },
      { speaker: 'roux', target: "Dommage. C'est tout, alors. Ça fait combien ?", native: "Shame. That's all, then. How much is that?" },
      { speaker: 'mar', target: 'Les pommes, trois euros, et les fraises, neuf euros. Ça fait douze euros.', native: "The apples, three euros, and the strawberries, nine euros. That's twelve euros." },
      { speaker: 'roux', target: 'Voilà. Bonne journée !', native: 'Here you are. Have a good day!' },
    ],
    questions: [
      { id: 'q1', question: 'How many kilos of apples does she buy?', options: ['1', '2', '3', '5'], answers: ['1'] },
      { id: 'q2', question: 'How much is one punnet of strawberries?', options: ['€4.50', '€4.15', '€9.00', '€14.50'], answers: ['€4.50'] },
      {
        id: 'q3',
        question: 'Why are there no cherries?',
        options: ["It's too early in the season.", "They're too expensive.", "They've sold out.", "He doesn't sell them."],
        answers: ["It's too early in the season."],
      },
      { id: 'q4', question: 'What is the total? Type the number of euros.', answers: ['12', 'douze', 'twelve', '€12', '12 euros'], answerLang: 'native' },
    ],
    itemIds: [m.kilo.id, m.pommes.id, m.avecceci.id, m.combiencoutent.id, m.fraises.id, m.jeprends.id, m.cesttout.id, p.cafait.id],
  },
  {
    id: 'fr.u4.listen.sale',
    unitId: 'fr.u4',
    level: 'A1',
    title: 'Les soldes commencent',
    kind: 'announcement',
    setting: 'An announcement over the speakers in a department store in Lyon.',
    speakers: { ann: { name: 'Julie', voice: 'a' } },
    lines: [
      { speaker: 'ann', target: 'Chers clients, bonjour et bienvenue au magasin Bellecour !', native: 'Dear customers, hello and welcome to the Bellecour store!' },
      { speaker: 'ann', target: "Aujourd'hui, c'est le premier jour des soldes.", native: "Today is the first day of the sales." },
      { speaker: 'ann', target: 'Les robes et les vestes sont à moins cinquante pour cent.', native: 'Dresses and jackets are fifty per cent off.' },
      { speaker: 'ann', target: 'Les chaussures sont à moins trente pour cent.', native: 'Shoes are thirty per cent off.' },
      { speaker: 'ann', target: 'Et les pulls en laine sont à vingt-neuf euros.', native: 'And wool jumpers are twenty-nine euros.' },
      { speaker: 'ann', target: 'Vous pouvez payer par carte, sans contact ou en espèces.', native: 'You can pay by card, contactless or in cash.' },
      { speaker: 'ann', target: "Le magasin est ouvert jusqu'à vingt heures. Merci et bonne journée !", native: 'The store is open until eight in the evening. Thank you, and have a good day!' },
    ],
    questions: [
      { id: 'q1', question: 'What is fifty per cent off?', options: ['Dresses and jackets', 'Shoes', 'Wool jumpers', 'Everything'], answers: ['Dresses and jackets'] },
      { id: 'q2', question: 'How much are the wool jumpers?', options: ['€29', '€39', '€19', '€25'], answers: ['€29'] },
      { id: 'q3', question: 'Which way of paying is not mentioned?', options: ['Cheque', 'Card', 'Contactless', 'Cash'], answers: ['Cheque'] },
      {
        id: 'q4',
        question: 'Until what time is the store open? Type the time.',
        answers: ['20', '20:00', '20h', '8 pm', '8pm', '8', '20 heures', 'vingt heures', '8 o’clock', '8 p.m.', '8 in the evening'],
        answerLang: 'native',
      },
    ],
    itemIds: [v.robe.id, v.chaussures.id, v.pull.id, p.parcarte.id, p.sanscontact.id, p.enespeces.id],
  },
]

export const conversations4: Conversation[] = [
  {
    id: 'fr.u4.talk.market',
    unitId: 'fr.u4',
    level: 'A1',
    title: 'Buying Picnic Food',
    place: 'A Saturday Market',
    setting: 'You are getting food for a picnic. At a market stall, buy what you need.',
    register: 'formal',
    partner: { name: 'La marchande', voice: 'a' },
    turns: [
      { kind: 'partner', target: "Bonjour ! Qu'est-ce que je vous sers ?", native: 'Hello! What can I get you?' },
      {
        kind: 'learner',
        goal: 'Greet her and ask for a piece of cheese.',
        slots: [
          { label: 'greet her', any: ['bonjour', 'bonsoir'] },
          { label: 'ask for a piece of cheese', any: ['un morceau de', 'du fromage', 'du comté'] },
        ],
        models: ["Bonjour, je voudrais un morceau de fromage, s'il vous plaît."],
      },
      { kind: 'partner', target: 'Du comté ? Il est très bon. Et avec ceci ?', native: "Some Comté? It's very good. Anything else?" },
      {
        kind: 'learner',
        goal: 'Ask how much the strawberries are.',
        slots: [
          { label: 'ask the price', any: ['combien'] },
          { label: 'mention the strawberries', any: ['les fraises', 'fraises'] },
        ],
        models: ['Combien coûtent les fraises ?'],
        tip: 'Coûtent, because there are several strawberries.',
      },
      { kind: 'partner', target: 'Cinq euros les cinq cents grammes.', native: 'Five euros for 500 grams.' },
      {
        kind: 'learner',
        goal: 'Ask for 500 grams of strawberries.',
        slots: [{ label: 'ask for 500 grams', any: ['cinq cents grammes', '500 grammes', '500 g', 'une livre'] }],
        models: ["Cinq cents grammes de fraises, s'il vous plaît.", 'Je prends cinq cents grammes de fraises.'],
      },
      { kind: 'partner', target: 'Voilà. Avec ceci ?', native: 'Here you are. Anything else?' },
      {
        kind: 'learner',
        goal: "Say that's all and ask how much it comes to.",
        slots: [
          { label: "say that's all", any: ["c'est tout"] },
          { label: 'ask for the total', any: ['combien'] },
        ],
        models: ["C'est tout, merci. Ça fait combien ?"],
      },
      { kind: 'partner', target: "Ça fait onze euros vingt, s'il vous plaît.", native: "That's eleven euros twenty, please." },
      {
        kind: 'learner',
        goal: 'Ask if you can pay by card.',
        slots: [{ label: 'ask to pay by card', any: ['par carte', 'sans contact'] }],
        models: ['Je peux payer par carte ?'],
        tip: 'Some market stalls only take cash, en espèces.',
      },
      { kind: 'partner', target: 'Ah non, désolée, en espèces seulement.', native: 'Oh no, sorry, cash only.' },
      {
        kind: 'learner',
        goal: 'Say all right, hand over the money and say goodbye.',
        slots: [
          { label: 'hand it over', any: ['voilà', 'voici'] },
          { label: 'say goodbye', any: ['au revoir', 'bonne journée', 'à bientôt'] },
        ],
        models: ["D'accord, voilà. Merci, au revoir !"],
      },
    ],
    itemIds: [m.morceau.id, m.avecceci.id, m.combiencoutent.id, m.cinqcents.id, m.cesttout.id, p.parcarte.id, p.enespeces.id],
  },
  {
    id: 'fr.u4.talk.likes',
    unitId: 'fr.u4',
    level: 'A1',
    title: 'Getting to Know Hugo',
    place: 'The Conference Canteen',
    setting: 'At lunch, your colleague Hugo wants to know what you like.',
    register: 'informal',
    partner: { name: 'Hugo', voice: 'b' },
    turns: [
      { kind: 'partner', target: 'Alors, tu aimes Lyon ?', native: 'So, do you like Lyon?' },
      {
        kind: 'learner',
        goal: 'Say yes, you love it.',
        slots: [{ label: 'say you love it', any: ["j'adore", "j'aime"] }],
        models: ["Oui, j'adore Lyon !"],
      },
      { kind: 'partner', target: 'Super ! Et tu aimes la cuisine lyonnaise ?', native: 'Great! And do you like Lyon cooking?' },
      {
        kind: 'learner',
        goal: 'Say yes, and name a food you love.',
        slots: [
          { label: 'say you like it', any: ["j'aime", "j'adore"] },
          { label: 'name a food with its article', any: ['le fromage', 'le comté', 'le pain', 'les fraises', 'les pommes', 'les tomates', 'le poulet', 'le chocolat', 'le vin', 'le café', 'le thé', 'la cuisine'] },
        ],
        models: ["Oui, j'adore le fromage !", "Oui, j'aime beaucoup la cuisine lyonnaise."],
        tip: "Keep the article after aimer: j'aime le fromage.",
      },
      { kind: 'partner', target: "Moi aussi ! Et le week-end, qu'est-ce que tu aimes faire ?", native: 'Me too! And at the weekend, what do you like doing?' },
      {
        kind: 'learner',
        goal: 'Say what you like doing.',
        slots: [
          { label: 'say you like it', any: ["j'aime", "j'adore", 'je préfère'] },
          { label: 'name an activity', any: ['lire', 'voyager', 'cuisiner', 'manger', 'marcher', 'danser', 'nager', 'courir', 'chanter'] },
        ],
        models: ["J'aime lire et voyager."],
      },
      { kind: 'partner', target: "Moi, je n'aime pas lire. Je préfère le sport.", native: "I don't like reading. I prefer sport." },
      {
        kind: 'learner',
        goal: 'Ask if he likes cooking.',
        slots: [
          { label: 'ask if he likes it', any: ['tu aimes', 'est-ce que tu aimes'] },
          { label: 'mention cooking', any: ['cuisiner', 'la cuisine'] },
        ],
        models: ['Tu aimes cuisiner ?'],
      },
      { kind: 'partner', target: 'Pas du tout ! Je déteste cuisiner. Je mange au restaurant.', native: 'Not at all! I hate cooking. I eat at restaurants.' },
      {
        kind: 'learner',
        goal: "Say you don't like cooking either.",
        slots: [{ label: 'agree with a negative', any: ['moi non plus'] }],
        models: ['Moi non plus !'],
        tip: 'After a negative, agree with moi non plus, not moi aussi.',
      },
      { kind: 'partner', target: 'Ha ! Alors, on mange ensemble dans un bouchon ce soir ?', native: 'Ha! So, shall we eat together at a bouchon tonight?' },
      {
        kind: 'learner',
        goal: 'Say yes, great, and see you tonight.',
        slots: [
          { label: 'accept', any: ['oui', 'avec plaisir', "d'accord", 'super', 'parfait'] },
          { label: 'say see you tonight', any: ['à ce soir'] },
        ],
        models: ['Oui, super ! À ce soir !'],
      },
    ],
    itemIds: [a.jadore.id, a.jaime.id, a.lire.id, a.voyager.id, a.tuaimes.id, a.cuisiner.id, a.moinonplus.id, w.cesoir.id],
  },
]
