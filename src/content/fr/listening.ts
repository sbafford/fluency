import type { ListeningPiece } from '../../engine/types'
import { unit1Items } from './unit1'
import { unit2Items } from './unit2'

const { g, n, o, c } = unit1Items
const { t, d, h, w } = unit2Items

/*
 * Listening practice. Each piece stretches slightly beyond the lesson
 * vocabulary, as real listening does: a few unknown words, with the key
 * information carried by words the learner has met.
 */

export const listening: ListeningPiece[] = [
  {
    id: 'fr.u1.listen.hotel',
    unitId: 'fr.u1',
    level: 'A1',
    title: "À la réception de l'hôtel",
    kind: 'dialogue',
    setting: 'A guest arrives at a small hotel in Lyon.',
    speakers: { rec: { name: 'Le réceptionniste', voice: 'b', pitch: 0.85 }, anna: { name: 'Anna', voice: 'a' } },
    lines: [
      { speaker: 'rec', target: "Bonsoir, madame. Bienvenue à l'hôtel Bellevue.", native: 'Good evening, madam. Welcome to the Hotel Bellevue.' },
      { speaker: 'anna', target: "Bonsoir. J'ai une réservation. Je m'appelle Anna Schmidt.", native: 'Good evening. I have a reservation. My name is Anna Schmidt.' },
      { speaker: 'rec', target: 'Anna Schmidt… Vous êtes allemande ?', native: 'Anna Schmidt… Are you German?' },
      { speaker: 'anna', target: "Non, je suis suisse. J'habite à Zurich.", native: "No, I'm Swiss. I live in Zurich." },
      { speaker: 'rec', target: "Très bien. Votre chambre, c'est la chambre dix.", native: 'Very good. Your room is room ten.' },
      { speaker: 'anna', target: 'Dix ? Merci beaucoup.', native: 'Ten? Thank you very much.' },
      { speaker: 'rec', target: 'De rien. Bonne soirée, madame !', native: "You're welcome. Have a good evening, madam!" },
    ],
    questions: [
      { id: 'q1', question: 'What time of day is it?', options: ['Morning', 'Evening', 'Lunchtime'], answers: ['Evening'] },
      { id: 'q2', question: 'Where does Anna live?', options: ['Zurich', 'Berlin', 'Paris', 'Geneva'], answers: ['Zurich'] },
      { id: 'q3', question: "What is Anna's nationality?", options: ['Swiss', 'German', 'French', 'Austrian'], answers: ['Swiss'] },
      { id: 'q4', question: 'What is her room number? Type the number.', answers: ['10', 'ten', 'dix'], answerLang: 'native' },
    ],
    itemIds: [g.bonsoir.id, n.jemappelle.id, n.vousetes.id, o.jhabite.id, c.dix.id, g.derien.id],
  },
  {
    id: 'fr.u1.listen.announce',
    unitId: 'fr.u1',
    level: 'A1',
    title: 'Bienvenue à la conférence',
    kind: 'announcement',
    setting: 'An announcement in the main hall on the first morning of the conference.',
    speakers: { claire: { name: 'Claire Dubois', voice: 'a' } },
    lines: [
      { speaker: 'claire', target: 'Bonjour à tous et bienvenue !', native: 'Hello everyone, and welcome!' },
      { speaker: 'claire', target: "Je m'appelle Claire Dubois.", native: 'My name is Claire Dubois.' },
      { speaker: 'claire', target: 'La conférence commence à neuf heures, dans la salle deux.', native: 'The conference starts at nine o\'clock, in room two.' },
      { speaker: 'claire', target: 'La pause café est à dix heures.', native: 'The coffee break is at ten o\'clock.' },
      { speaker: 'claire', target: 'Merci, et bonne journée à tous !', native: 'Thank you, and have a good day, everyone!' },
    ],
    questions: [
      { id: 'q1', question: 'Who is speaking?', options: ['Claire Dubois', 'Claire Dupont', 'Clara Dubois'], answers: ['Claire Dubois'] },
      { id: 'q2', question: 'Which room is the conference in?', options: ['Room 2', 'Room 9', 'Room 10', 'Room 12'], answers: ['Room 2'] },
      { id: 'q3', question: 'When is the coffee break?', options: ['9:00', '10:00', '2:00', '12:00'], answers: ['10:00'] },
    ],
    itemIds: [n.jemappelle.id, c.neuf.id, c.deux.id, c.dix.id, c.bonnejournee.id],
  },
  {
    id: 'fr.u1.listen.friends',
    unitId: 'fr.u1',
    level: 'A1',
    title: 'Entre amis',
    kind: 'dialogue',
    setting: 'Léa bumps into her friend Hugo and introduces someone new.',
    speakers: {
      lea: { name: 'Léa', voice: 'a' },
      hugo: { name: 'Hugo', voice: 'b' },
      sam: { name: 'Sam', voice: 'b', pitch: 1.2 },
    },
    lines: [
      { speaker: 'lea', target: 'Salut Hugo ! Ça va ?', native: "Hi Hugo! How's it going?" },
      { speaker: 'hugo', target: 'Salut Léa ! Ça va bien, et toi ?', native: 'Hi Léa! Fine, and you?' },
      { speaker: 'lea', target: 'Très bien. Hugo, voici Sam. Il est anglais.', native: "Very good. Hugo, this is Sam. He's English." },
      { speaker: 'sam', target: 'Salut ! Enchanté.', native: 'Hi! Nice to meet you.' },
      { speaker: 'hugo', target: 'Enchanté ! Tu habites à Paris, Sam ?', native: 'Nice to meet you! Do you live in Paris, Sam?' },
      { speaker: 'sam', target: 'Oui, je suis étudiant ici.', native: "Yes, I'm a student here." },
    ],
    questions: [
      { id: 'q1', question: 'Do Léa and Hugo say tu or vous to each other?', options: ['tu', 'vous'], answers: ['tu'] },
      { id: 'q2', question: 'Where is Sam from?', options: ['England', 'France', 'Australia', 'Switzerland'], answers: ['England'] },
      { id: 'q3', question: 'What does Sam do?', options: ["He's a student", "He's a journalist", 'He works in communications'], answers: ["He's a student"] },
      { id: 'q4', question: 'How does Sam say "nice to meet you"? Type it in French.', answers: ['enchanté'], answerLang: 'target' },
    ],
    itemIds: [g.salut.id, g.cava.id, g.ettoi.id, n.enchante.id, o.anglais.id, o.etudiant.id],
  },
  {
    id: 'fr.u2.listen.station',
    unitId: 'fr.u2',
    level: 'A1',
    title: 'Annonce en gare',
    kind: 'announcement',
    setting: 'Announcements on the platform at Lyon Part-Dieu station.',
    speakers: { annonce: { name: 'Annonce', voice: 'a' } },
    lines: [
      { speaker: 'annonce', target: 'Mesdames et messieurs, bonjour.', native: 'Good morning, ladies and gentlemen.' },
      { speaker: 'annonce', target: 'Le train pour Genève partira à dix heures quarante-cinq, voie sept.', native: 'The train to Geneva will leave at 10:45, platform seven.' },
      { speaker: 'annonce', target: 'Le train pour Paris partira à onze heures quinze, voie douze.', native: 'The train to Paris will leave at 11:15, platform twelve.' },
      { speaker: 'annonce', target: 'Merci, et bon voyage.', native: 'Thank you, and have a good journey.' },
    ],
    questions: [
      { id: 'q1', question: 'When does the train to Geneva leave?', options: ['10:45', '11:15', '10:15', '11:45'], answers: ['10:45'] },
      { id: 'q2', question: 'Which platform is the Geneva train on?', options: ['7', '12', '17', '2'], answers: ['7'] },
      { id: 'q3', question: 'Where is the 11:15 train going?', options: ['Paris', 'Geneva', 'Lyon', 'Zurich'], answers: ['Paris'] },
      { id: 'q4', question: 'Which platform is the Paris train on? Type the number.', answers: ['12', 'twelve', 'douze'], answerLang: 'native' },
    ],
    itemIds: [t.douze.id, c.sept.id, d.quarante.id, t.quinze.id, t.onze.id, h.heures.id],
  },
  {
    id: 'fr.u2.listen.booking',
    unitId: 'fr.u2',
    level: 'A1',
    title: 'Un rendez-vous',
    kind: 'dialogue',
    setting: 'Inès phones a hair salon to book an appointment.',
    speakers: { salon: { name: 'Le salon', voice: 'b', pitch: 0.85 }, ines: { name: 'Inès', voice: 'a' } },
    lines: [
      { speaker: 'salon', target: 'Salon Élégance, bonjour !', native: 'Élégance salon, hello!' },
      { speaker: 'ines', target: "Bonjour, je voudrais un rendez-vous, s'il vous plaît.", native: "Hello, I'd like an appointment, please." },
      { speaker: 'salon', target: 'Oui. Mardi, ça va ?', native: 'Yes. Is Tuesday all right?' },
      { speaker: 'ines', target: 'Mardi, non. Mercredi ?', native: 'Not Tuesday. Wednesday?' },
      { speaker: 'salon', target: 'Mercredi à quatorze heures trente ?', native: 'Wednesday at 14:30?' },
      { speaker: 'ines', target: "Parfait. Je m'appelle Inès Martin.", native: 'Perfect. My name is Inès Martin.' },
      { speaker: 'salon', target: 'Très bien, madame Martin. À mercredi !', native: 'Very good, Ms Martin. See you on Wednesday!' },
    ],
    questions: [
      { id: 'q1', question: 'Which day is the appointment?', options: ['Wednesday', 'Tuesday', 'Thursday', 'Monday'], answers: ['Wednesday'] },
      { id: 'q2', question: 'What time is it?', options: ['2:30 pm', '4:30 pm', '2:00 pm', '12:30 pm'], answers: ['2:30 pm'] },
      { id: 'q3', question: "What is the caller's surname?", answers: ['Martin'], answerLang: 'native' },
    ],
    itemIds: [w.mardi.id, w.mercredi.id, t.quatorze.id, c.jevoudrais.id, h.heures.id],
  },
]
