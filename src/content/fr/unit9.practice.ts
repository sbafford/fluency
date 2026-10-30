import type { Conversation, ListeningPiece } from '../../engine/types'
import { unit1Items } from './unit1'
import { unit2Items } from './unit2'
import { unit9Items } from './unit9'

const { g } = unit1Items
const { w } = unit2Items
const { b, rv, ph, cs } = unit9Items

/*
 * Unit 9 listening and conversations: the surgery's answerphone, Léa at the
 * pharmacy, booking an appointment by phone and seeing the doctor.
 */

export const listening9: ListeningPiece[] = [
  {
    id: 'fr.u9.listen.answerphone',
    unitId: 'fr.u9',
    level: 'A2',
    title: 'Le répondeur du cabinet',
    kind: 'announcement',
    setting: "Sarah phones the doctor's surgery on a Saturday and gets the answerphone.",
    speakers: { rep: { name: 'Annonce', voice: 'a' } },
    lines: [
      { speaker: 'rep', target: 'Bonjour, vous êtes bien au cabinet du docteur Lambert.', native: "Hello, you've reached Dr Lambert's surgery." },
      { speaker: 'rep', target: 'Le cabinet est fermé le samedi et le dimanche.', native: 'The surgery is closed on Saturdays and Sundays.' },
      { speaker: 'rep', target: 'Du lundi au vendredi, nous sommes ouverts de huit heures à dix-neuf heures.', native: "From Monday to Friday, we're open from eight in the morning to seven in the evening." },
      { speaker: 'rep', target: 'Pour prendre rendez-vous, rappelez lundi ou réservez en ligne.', native: 'To make an appointment, call back on Monday or book online.' },
      { speaker: 'rep', target: "En cas d'urgence, appelez le 15. Merci et bonne journée.", native: 'In an emergency, call 15. Thank you and have a good day.' },
    ],
    questions: [
      { id: 'q1', question: 'When is the surgery closed?', options: ['At the weekend', 'On Mondays', 'Every evening after six', 'On Fridays'], answers: ['At the weekend'] },
      { id: 'q2', question: 'What time does it close on weekdays?', options: ['7 pm', '8 pm', '9 pm', '6 pm'], answers: ['7 pm'] },
      {
        id: 'q3',
        question: 'How can you make an appointment?',
        options: ['Call back on Monday or book online', 'Call 15 or book online', 'Come in on Saturday', 'Send an e-mail to the doctor'],
        answers: ['Call back on Monday or book online'],
      },
      { id: 'q4', question: 'Which number do you call in an emergency? Type it as a number.', answers: ['15', 'fifteen', 'quinze'], answerLang: 'native' },
    ],
    itemIds: [rv.cabinet.id, rv.rdv.id, cs.samu.id, w.lundi.id, w.samedi.id],
  },
  {
    id: 'fr.u9.listen.pharmacy',
    unitId: 'fr.u9',
    level: 'A2',
    title: 'Léa à la pharmacie',
    kind: 'dialogue',
    setting: 'Léa has had a bad night. She asks the pharmacist for help before work.',
    speakers: { lea: { name: 'Léa', voice: 'a' }, ph: { name: 'Le pharmacien', voice: 'b' } },
    lines: [
      { speaker: 'ph', target: "Bonjour, madame. Qu'est-ce qui ne va pas ?", native: "Hello. What's wrong?" },
      { speaker: 'lea', target: "J'ai mal à la tête depuis ce matin, et je suis très fatiguée.", native: "I've had a headache since this morning, and I'm very tired." },
      { speaker: 'ph', target: 'Vous avez de la fièvre ?', native: 'Have you got a temperature?' },
      { speaker: 'lea', target: "Non, je ne pense pas. Mais j'ai mal dormi.", native: "No, I don't think so. But I slept badly." },
      { speaker: 'ph', target: 'Alors, prenez du paracétamol : un comprimé, trois fois par jour maximum.', native: 'Then take some paracetamol: one tablet, three times a day at most.' },
      { speaker: 'lea', target: "D'accord. Et je peux boire du café ?", native: 'OK. And can I drink coffee?' },
      { speaker: 'ph', target: "Un peu, mais buvez surtout de l'eau. Et il faut dormir !", native: 'A little, but mostly drink water. And you need to sleep!' },
      { speaker: 'lea', target: 'Merci beaucoup. Je vous dois combien ?', native: 'Thank you very much. How much do I owe you?' },
      { speaker: 'ph', target: "Trois euros, s'il vous plaît.", native: 'Three euros, please.' },
    ],
    questions: [
      { id: 'q1', question: "What's wrong with Léa?", options: ["A headache, and she's tired", 'A sore throat and a temperature', 'Stomach ache', 'A cough'], answers: ["A headache, and she's tired"] },
      { id: 'q2', question: 'Since when?', options: ['This morning', 'Yesterday', 'Two days ago', 'Last week'], answers: ['This morning'] },
      { id: 'q3', question: 'How many tablets should she take at a time?', options: ['One', 'Two', 'Three', 'Six'], answers: ['One'] },
      { id: 'q4', question: 'What does the pharmacist say she needs to do at the end? Type one word in English.', answers: ['sleep', 'to sleep', 'get some sleep', 'sleep more'], answerLang: 'native' },
    ],
    itemIds: [b.tete.id, b.fatigue.id, b.fievre.id, ph.comprimes.id, ph.foisparjour.id, cs.ilfaut.id, ph.jevousdois.id, b.quinevapas.id],
  },
]

export const conversations9: Conversation[] = [
  {
    id: 'fr.u9.talk.appointment',
    unitId: 'fr.u9',
    level: 'A2',
    title: 'Booking the Doctor',
    place: "The Doctor's Surgery, by Phone",
    setting: "You've had backache for a few days. Phone the surgery for an appointment.",
    register: 'formal',
    partner: { name: 'La secrétaire', voice: 'a' },
    turns: [
      { kind: 'partner', target: 'Cabinet du docteur Lambert, bonjour.', native: "Dr Lambert's surgery, hello." },
      {
        kind: 'learner',
        goal: 'Greet her and ask for an appointment.',
        slots: [
          { label: 'greet her', any: ['bonjour'] },
          { label: 'ask for an appointment', any: ['rendez-vous'] },
        ],
        models: ["Bonjour, je voudrais prendre rendez-vous, s'il vous plaît."],
      },
      { kind: 'partner', target: "Bien sûr. Qu'est-ce qui ne va pas ?", native: "Of course. What's wrong?" },
      {
        kind: 'learner',
        goal: 'Say your back hurts, and for how long.',
        slots: [
          { label: 'say your back hurts', any: ['mal au dos'] },
          { label: 'say how long', any: ['depuis'] },
        ],
        models: ["J'ai mal au dos depuis trois jours."],
        tip: 'Use the present tense with depuis: j\'ai mal depuis…',
      },
      { kind: 'partner', target: 'Je vois. Demain à neuf heures, ça vous va ?', native: 'I see. Tomorrow at nine, does that suit you?' },
      {
        kind: 'learner',
        goal: 'Say you work in the morning and ask for later.',
        slots: [{ label: 'ask for later', any: ['plus tard', "l'après-midi", 'le soir'] }],
        models: ["Le matin, je travaille. Plus tard, c'est possible ?"],
      },
      { kind: 'partner', target: 'Alors, demain à dix-huit heures ?', native: 'Then tomorrow at six pm?' },
      {
        kind: 'learner',
        goal: 'Accept the time.',
        slots: [{ label: 'say it suits you', any: ['ça me va', 'parfait', 'très bien', "d'accord", 'oui'] }],
        models: ['Oui, ça me va. Merci !'],
      },
      { kind: 'partner', target: "Très bien. Votre nom, s'il vous plaît ?", native: 'Very good. Your name, please?' },
      {
        kind: 'learner',
        goal: 'Give your name.',
        slots: [{ label: 'give your name', any: ["je m'appelle", "c'est", 'je suis', 'mon nom'] }],
        models: ["C'est {name}."],
      },
      { kind: 'partner', target: "Merci. N'oubliez pas votre carte Vitale. Au revoir !", native: "Thank you. Don't forget your health card. Goodbye!" },
      {
        kind: 'learner',
        goal: 'Thank her and say goodbye.',
        slots: [
          { label: 'thank her', any: ['merci'] },
          { label: 'say goodbye', any: ['au revoir', 'bonne journée', 'à demain'] },
        ],
        models: ['Merci, au revoir !'],
      },
    ],
    itemIds: [rv.rdv.id, rv.cavousva.id, rv.camva.id, rv.plustard.id, rv.depuisjours.id, rv.cartevitale.id, b.dos.id, g.bonjour.id, g.merci.id, g.aurevoir.id],
  },
  {
    id: 'fr.u9.talk.doctor',
    unitId: 'fr.u9',
    level: 'A2',
    title: 'Seeing the Doctor',
    place: "Dr Lambert's Consulting Room",
    setting: 'You have a bad cold. The doctor asks about your symptoms.',
    register: 'formal',
    partner: { name: 'Le médecin', voice: 'b' },
    turns: [
      { kind: 'partner', target: "Bonjour. Alors, qu'est-ce qui ne va pas ?", native: "Hello. So, what's wrong?" },
      {
        kind: 'learner',
        goal: "Say you're ill: you've got a sore throat and you're coughing.",
        slots: [
          { label: 'say your throat hurts', any: ['mal à la gorge'] },
          { label: "say you're coughing", any: ['je tousse', 'la toux'] },
        ],
        models: ["Je suis malade. J'ai mal à la gorge et je tousse."],
      },
      { kind: 'partner', target: 'Depuis quand ?', native: 'Since when?' },
      {
        kind: 'learner',
        goal: 'Say how long.',
        slots: [{ label: 'say how long', any: ['depuis'] }],
        models: ['Depuis deux jours.', 'Depuis lundi.'],
      },
      { kind: 'partner', target: 'Vous avez de la fièvre ?', native: 'Have you got a temperature?' },
      {
        kind: 'learner',
        goal: "Say yes, a little, and that you're very tired.",
        slots: [
          { label: 'say yes', any: ['oui'] },
          { label: "say you're tired", any: ['fatigué(e)'] },
        ],
        models: ['Oui, un peu. Et je suis très fatiguée.', 'Oui, un peu, et je suis fatigué.'],
      },
      { kind: 'partner', target: "C'est un gros rhume. Prenez ce sirop trois fois par jour, et reposez-vous.", native: "It's a bad cold. Take this syrup three times a day, and get some rest." },
      {
        kind: 'learner',
        goal: 'Ask if you can work tomorrow.',
        slots: [{ label: 'ask if you can work', any: ['je peux travailler', 'travailler'] }],
        models: ['Je peux travailler demain ?'],
      },
      { kind: 'partner', target: 'Non, il ne faut pas travailler cette semaine. Vous devez rester à la maison.', native: "No, you mustn't work this week. You have to stay at home." },
      {
        kind: 'learner',
        goal: 'Say OK, thank the doctor and ask how much you owe.',
        slots: [
          { label: 'thank the doctor', any: ['merci'] },
          { label: 'ask how much', any: ['combien'] },
        ],
        models: ["D'accord, merci docteur. Je vous dois combien ?"],
      },
    ],
    itemIds: [b.malade.id, b.gorge.id, b.tousse.id, b.fievre.id, b.fatigue.id, rv.depuisquand.id, ph.sirop.id, ph.foisparjour.id, ph.reposezvous.id, cs.ilnefautpas.id, cs.vousdevez.id, ph.jevousdois.id, g.merci.id],
  },
]
