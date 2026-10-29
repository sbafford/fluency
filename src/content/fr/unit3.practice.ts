import type { Conversation, ListeningPiece } from '../../engine/types'
import { unit1Items } from './unit1'
import { unit2Items } from './unit2'
import { unit3Items } from './unit3'

const { g, c } = unit1Items
const { t } = unit2Items
const { f, p, m, q } = unit3Items

/*
 * Unit 3 listening and conversation practice: family, describing people,
 * home and neighbourhood.
 */

export const listening3: ListeningPiece[] = [
  {
    id: 'fr.u3.listen.voicemail',
    unitId: 'fr.u3',
    level: 'A1',
    title: 'Un message de Madame Roux',
    kind: 'monologue',
    setting: 'Madame Roux leaves a voicemail for a new tenant, Monsieur Martin, who arrives on Saturday.',
    speakers: { roux: { name: 'Madame Roux', voice: 'a' } },
    lines: [
      { speaker: 'roux', target: "Bonjour, monsieur Martin, c'est Madame Roux, la propriétaire.", native: "Hello, Mr Martin, it's Madame Roux, the owner." },
      { speaker: 'roux', target: "L'appartement est au deuxième étage. C'est l'appartement douze.", native: "The flat is on the second floor. It's flat twelve." },
      { speaker: 'roux', target: 'Il y a une chambre, un salon et un petit balcon.', native: "There's one bedroom, a living room and a small balcony." },
      { speaker: 'roux', target: 'La boulangerie est en face, et le supermarché est à côté de la pharmacie.', native: 'The bakery is opposite, and the supermarket is next to the pharmacy.' },
      { speaker: 'roux', target: 'Les clés sont à la boulangerie. À samedi !', native: 'The keys are at the bakery. See you on Saturday!' },
    ],
    questions: [
      { id: 'q1', question: 'Which floor is the flat on?', options: ['Second floor', 'First floor', 'Ground floor', 'Twelfth floor'], answers: ['Second floor'] },
      { id: 'q2', question: 'What is the flat number? Type the number.', answers: ['12', 'twelve', 'douze'], answerLang: 'native' },
      { id: 'q3', question: 'Where is the bakery?', options: ['Opposite the flat', 'Next to the pharmacy', 'Next to the station', 'Far from the flat'], answers: ['Opposite the flat'] },
      { id: 'q4', question: 'Where are the keys?', options: ['At the bakery', 'At the pharmacy', 'At the supermarket', 'On the balcony'], answers: ['At the bakery'] },
    ],
    itemIds: [m.chambre.id, m.salon.id, m.balcon.id, q.boulangerie.id, q.enface.id, q.acote.id, t.douze.id],
  },
  {
    id: 'fr.u3.listen.family',
    unitId: 'fr.u3',
    level: 'A1',
    title: 'La famille de Hugo',
    kind: 'dialogue',
    setting: 'Léa looks at the photo on Hugo\'s desk.',
    speakers: { lea: { name: 'Léa', voice: 'a' }, hugo: { name: 'Hugo', voice: 'b' } },
    lines: [
      { speaker: 'lea', target: "Oh, la jolie photo ! C'est ta famille ?", native: 'Oh, what a lovely photo! Is that your family?' },
      { speaker: 'hugo', target: 'Oui. Voici ma femme, Camille, et mes enfants.', native: 'Yes. This is my wife, Camille, and my children.' },
      { speaker: 'lea', target: 'Ils ont quel âge ?', native: 'How old are they?' },
      { speaker: 'hugo', target: 'Ma fille, Zoé, a six ans, et mon fils, Louis, a trois ans.', native: 'My daughter, Zoé, is six, and my son, Louis, is three.' },
      { speaker: 'lea', target: 'Zoé a les cheveux blonds, comme Camille !', native: 'Zoé has fair hair, like Camille!' },
      { speaker: 'hugo', target: 'Oui, et Louis a les yeux marron, comme moi.', native: 'Yes, and Louis has brown eyes, like me.' },
      { speaker: 'lea', target: 'Il est timide ?', native: 'Is he shy?' },
      { speaker: 'hugo', target: 'Non, pas du tout ! Il est très drôle.', native: 'No, not at all! He is very funny.' },
    ],
    questions: [
      { id: 'q1', question: "What is Hugo's wife called?", options: ['Camille', 'Zoé', 'Léa', 'Claire'], answers: ['Camille'] },
      { id: 'q2', question: 'How old is his son? Type the number.', answers: ['3', 'three', 'trois'], answerLang: 'native' },
      { id: 'q3', question: 'Who has fair hair?', options: ['Zoé and Camille', 'Louis and Hugo', 'Zoé and Hugo', 'Only Louis'], answers: ['Zoé and Camille'] },
      { id: 'q4', question: 'What is Louis like?', options: ['Very funny', 'Very shy', 'Quite tall', 'A little shy'], answers: ['Very funny'] },
    ],
    itemIds: [f.mafemme.id, f.mesenfants.id, f.mafille.id, f.monfils.id, p.blonds.id, p.marron.id, p.timide.id, p.drole.id, c.trois.id, c.six.id],
  },
]

const DESCRIBE = [
  'grand',
  'grande',
  'grands',
  'grandes',
  'petit',
  'petite',
  'petits',
  'petites',
  'jeune',
  'jeunes',
  'sympa',
  'sympas',
  'sympathique',
  'gentil',
  'gentille',
  'gentils',
  'gentilles',
  'drôle',
  'drôles',
  'timide',
  'timides',
]

export const conversations3: Conversation[] = [
  {
    id: 'fr.u3.talk.family',
    unitId: 'fr.u3',
    level: 'A1',
    title: 'Talking About Family',
    place: 'The Coffee Break',
    setting: 'At the coffee break, Hugo asks about your family.',
    register: 'informal',
    partner: { name: 'Hugo', voice: 'b' },
    turns: [
      { kind: 'partner', target: 'Salut ! Dis, tu as des frères et sœurs ?', native: 'Hi! Tell me, do you have brothers and sisters?' },
      {
        kind: 'learner',
        goal: 'Say which brothers or sisters you have.',
        slots: [
          { label: "start with j'ai", any: ["j'ai"] },
          { label: 'mention a brother or sister', any: ['frère', 'frères', 'sœur', 'sœurs', 'soeur', 'soeurs'] },
        ],
        models: ["Oui, j'ai un frère et une sœur.", "J'ai deux sœurs."],
        tip: 'Frère is masculine and sœur is feminine: un frère, une sœur.',
      },
      { kind: 'partner', target: 'Et ils sont comment ?', native: 'And what are they like?' },
      {
        kind: 'learner',
        goal: 'Describe one of them.',
        slots: [
          { label: 'say who', any: ['mon frère', 'ma sœur', 'ma soeur', 'mes frères', 'mes sœurs', 'mes soeurs', 'il est', 'elle est', 'ils sont', 'elles sont'] },
          { label: 'describe them', any: DESCRIBE },
        ],
        models: ['Mon frère est grand et très drôle.', 'Ma sœur est petite et gentille.'],
        tip: 'Make the adjective agree: ma sœur est grande.',
      },
      { kind: 'partner', target: "Super ! Moi, j'ai une fille et un fils.", native: 'Great! I have a daughter and a son.' },
      {
        kind: 'learner',
        goal: 'Ask what his daughter is like.',
        slots: [
          { label: 'mention his daughter', any: ['ta fille'] },
          { label: 'ask what she is like', any: ['comment'] },
        ],
        models: ['Et ta fille, elle est comment ?'],
        tip: 'To a friend, "your" is ta before a feminine word: ta fille.',
      },
      { kind: 'partner', target: 'Elle a six ans. Elle est blonde et très drôle !', native: "She's six. She's blonde and very funny!" },
      {
        kind: 'learner',
        goal: 'React, then say see you soon.',
        slots: [
          { label: 'react', any: ['super', 'génial', 'très bien', 'parfait', 'trop bien', 'elle est sympa', 'elle est drôle'] },
          { label: 'say see you soon', any: ['à bientôt', 'à plus tard', "à tout à l'heure", 'à plus', 'salut'] },
        ],
        models: ['Super ! À bientôt !'],
      },
    ],
    itemIds: [f.freresoeurs.id, f.monfrere.id, f.masoeur.id, p.commentest.id, f.mafille.id, g.abientot.id],
  },
  {
    id: 'fr.u3.talk.neighbourhood',
    unitId: 'fr.u3',
    level: 'A1',
    title: 'Settling In',
    place: 'Outside Your Flat',
    setting: 'Madame Roux, who owns your rented flat, stops you in the street and asks how things are.',
    register: 'formal',
    partner: { name: 'Madame Roux', voice: 'a' },
    turns: [
      { kind: 'partner', target: "Bonjour ! Alors, l'appartement, ça va ?", native: 'Hello! So, is the flat all right?' },
      {
        kind: 'learner',
        goal: 'Say hello and describe the flat in a word or two.',
        slots: [
          { label: 'greet her', any: ['bonjour', 'bonsoir'] },
          { label: 'describe the flat', any: ['clair', 'calme', 'grand', 'petit', 'sympa'] },
        ],
        models: ['Bonjour, madame ! Oui, il est très clair et calme.'],
        tip: "L'appartement is masculine, so use il and the masculine adjective.",
      },
      { kind: 'partner', target: 'Très bien ! Vous avez besoin de quelque chose ?', native: 'Very good! Do you need anything?' },
      {
        kind: 'learner',
        goal: 'Ask if there is a pharmacy near here.',
        slots: [
          { label: 'ask if there is', any: ['il y a', "est-ce qu'il y a", 'y a-t-il'] },
          { label: 'say a pharmacy', any: ['une pharmacie', 'la pharmacie'] },
        ],
        models: ["Il y a une pharmacie près d'ici ?"],
      },
      { kind: 'partner', target: 'Oui, en face de la gare, à côté de la banque.', native: 'Yes, opposite the station, next to the bank.' },
      {
        kind: 'learner',
        goal: 'Ask if the supermarket is far.',
        slots: [
          { label: 'mention the supermarket', any: ['le supermarché'] },
          { label: 'ask if it is far', any: ['loin'] },
        ],
        models: ["Et le supermarché, c'est loin ?"],
      },
      { kind: 'partner', target: "Non, il est près du marché. C'est à cinq minutes.", native: "No, it's near the market. It's five minutes away." },
      {
        kind: 'learner',
        goal: 'Thank her and say goodbye politely.',
        slots: [
          { label: 'thank her', any: ['merci'] },
          { label: 'say goodbye', any: ['au revoir', 'bonne journée', 'bonne soirée', 'à bientôt'] },
        ],
        models: ['Merci beaucoup, madame. Bonne journée !'],
      },
    ],
    itemIds: [m.clair.id, m.calme.id, q.pharmacie.id, q.pres.id, q.enface.id, q.acote.id, q.banque.id, q.supermarche.id, q.loin.id, g.merci.id],
  },
]
