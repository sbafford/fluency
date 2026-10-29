import type { Lesson, Unit } from '../../engine/types'
import { defineItems, steps } from '../define'

/*
 * French A1, Unit 2: Les chiffres et le temps (Numbers and time).
 * Original content. Sarah's conference week continues: a museum visit,
 * registering for a course, the day's timetable and making plans.
 */

/* ------------------------------------------------------------------ */
/* Lesson 1: De onze à vingt                                           */
/* ------------------------------------------------------------------ */

const t = defineItems('fr.u2.l1', {
  onze: { kind: 'word', target: 'onze', native: 'eleven', acceptNative: ['11'] },
  douze: { kind: 'word', target: 'douze', native: 'twelve', acceptNative: ['12'] },
  treize: { kind: 'word', target: 'treize', native: 'thirteen', acceptNative: ['13'] },
  quatorze: { kind: 'word', target: 'quatorze', native: 'fourteen', acceptNative: ['14'] },
  quinze: { kind: 'word', target: 'quinze', native: 'fifteen', acceptNative: ['15'], examples: [{ target: 'Nous sommes quinze.', native: 'There are fifteen of us.' }] },
  seize: { kind: 'word', target: 'seize', native: 'sixteen', acceptNative: ['16'], examples: [{ target: "C'est seize euros.", native: "It's sixteen euros." }] },
  dixsept: { kind: 'word', target: 'dix-sept', native: 'seventeen', acceptNative: ['17'] },
  dixhuit: { kind: 'word', target: 'dix-huit', native: 'eighteen', acceptNative: ['18'] },
  dixneuf: { kind: 'word', target: 'dix-neuf', native: 'nineteen', acceptNative: ['19'] },
  vingt: {
    kind: 'word',
    target: 'vingt',
    native: 'twenty',
    acceptNative: ['20'],
    note: 'The final t is silent on its own: "van".',
    examples: [{ target: 'Ça fait vingt euros.', native: "That's twenty euros." }],
  },
  ilya: {
    kind: 'phrase',
    target: 'il y a',
    native: 'there is, there are',
    acceptNative: ['there is', 'there are'],
    note: 'The same for one thing or many: il y a un enfant, il y a trois enfants.',
    examples: [{ target: 'Il y a trois enfants.', native: 'There are three children.' }],
  },
  combiende: {
    kind: 'pattern',
    target: 'combien de',
    native: 'how many, how much',
    acceptNative: ['how many', 'how much'],
    accept: ["combien d'"],
    note: "Before a vowel, de becomes d': combien d'enfants ?",
    examples: [{ target: 'Il y a combien de personnes ?', native: 'How many people are there?' }],
  },
})

const lesson1: Lesson = {
  id: 'fr.u2.l1',
  kind: 'lesson',
  title: 'De onze à vingt',
  subtitle: 'Numbers 11 to 20, and How Many',
  objectives: ['Count from eleven to twenty.', 'Say what there is with il y a.', 'Ask how many with combien de.'],
  canDo: ['a1.numbers', 'a1.needs'],
  minutes: 12,
  items: Object.values(t),
  dialogue: {
    id: 'fr.u2.l1.d',
    title: 'À la billetterie du musée',
    setting: 'Sarah takes a group from the conference to a museum and asks for tickets.',
    speakers: { agent: { name: "L'agent", voice: 'a' }, sarah: { name: 'Sarah', voice: 'b' } },
    lines: [
      { speaker: 'agent', target: 'Bonjour ! Vous êtes combien ?', native: 'Hello! How many of you are there?' },
      { speaker: 'sarah', target: 'Nous sommes quinze.', native: 'There are fifteen of us.' },
      { speaker: 'agent', target: "Quinze personnes. Il y a combien d'enfants ?", native: 'Fifteen people. How many children are there?' },
      { speaker: 'sarah', target: 'Il y a quatre enfants et onze adultes.', native: 'There are four children and eleven adults.' },
      { speaker: 'agent', target: "Très bien. Pour les enfants, c'est gratuit.", native: "Very good. It's free for children." },
      { speaker: 'sarah', target: "Super ! Et c'est combien pour les adultes ?", native: 'Great! And how much is it for adults?' },
      { speaker: 'agent', target: "C'est seize euros par personne.", native: "It's sixteen euros per person." },
      { speaker: 'sarah', target: "D'accord. Voilà.", native: 'All right. Here you are.' },
    ],
  },
  notes: [
    {
      id: 'fr.u2.l1.n1',
      title: 'Eleven to twenty',
      body: [
        'From eleven to sixteen, each number is its own word. From seventeen, French adds: *dix-sept* is "ten-seven".',
        'Watch the pairs that sound alike: *douze* (12) and *deux* (2), *treize* (13) and *trois* (3), *seize* (16) and *six* (6).',
      ],
      table: {
        rows: [
          ['11 onze', '16 seize'],
          ['12 douze', '17 dix-sept'],
          ['13 treize', '18 dix-huit'],
          ['14 quatorze', '19 dix-neuf'],
          ['15 quinze', '20 vingt'],
        ],
      },
    },
  ],
  culture: {
    title: 'Museum prices',
    body: [
      "At France's national museums, entry is free for under-18s, and for 18 to 25-year-olds who live in the EU. Ask for le tarif réduit (the reduced rate) if you qualify for a discount.",
    ],
  },
  exercises: steps('fr.u2.l1', [
    { type: 'dialogue' },
    { type: 'present', items: [t.onze, t.douze, t.treize, t.quatorze, t.quinze] },
    { type: 'listen-choose', items: [t.douze], audio: 'douze', options: ['12', '2', '20', '13'], answer: '12' },
    { type: 'listen-choose', items: [t.quatorze], audio: 'quatorze', options: ['14', '4', '15', '13'], answer: '14' },
    { type: 'type', items: [t.onze], prompt: '11', answers: ['onze'] },
    { type: 'present', items: [t.seize, t.dixsept, t.dixhuit, t.dixneuf, t.vingt] },
    { type: 'note', noteId: 'fr.u2.l1.n1' },
    { type: 'listen-choose', items: [t.seize], audio: 'seize', options: ['16', '6', '13', '19'], answer: '16' },
    { type: 'type', items: [t.dixsept], prompt: '17', answers: ['dix-sept'] },
    { type: 'listen-choose', items: [t.dixneuf], audio: 'dix-neuf', options: ['19', '9', '17', '18'], answer: '19' },
    { type: 'type', items: [t.quinze], prompt: '15', answers: ['quinze'] },
    { type: 'type', items: [t.dixhuit], prompt: '18', answers: ['dix-huit'] },
    {
      type: 'dictation',
      items: [t.vingt],
      audio: 'Ça fait vingt euros.',
      translation: "That's twenty euros.",
      answers: ['ça fait vingt euros', 'ça fait 20 euros'],
    },
    { type: 'present', items: [t.ilya, t.combiende] },
    {
      type: 'gap',
      items: [t.ilya],
      sentence: 'Il y ___ trois enfants.',
      translation: 'There are three children.',
      options: ['a', 'est', 'sont', 'as'],
      answer: 'a',
    },
    {
      type: 'choose',
      items: [t.combiende],
      prompt: 'How many children are there?',
      promptLang: 'native',
      options: ["Il y a combien d'enfants ?", 'Il y a trois enfants.', "C'est combien ?", 'Vous êtes combien ?'],
      answer: "Il y a combien d'enfants ?",
    },
    {
      type: 'build',
      items: [t.ilya, t.douze],
      prompt: 'There are twelve adults.',
      answer: ['Il', 'y', 'a', 'douze', 'adultes.'],
      distractors: ['sont', 'deux'],
    },
    { type: 'type', items: [t.treize], prompt: '13', answers: ['treize'] },
    {
      type: 'listen-choose',
      items: [t.quatorze, t.ilya],
      audio: 'Il y a quatorze enfants.',
      options: ['There are 14 children.', 'There are 4 children.', 'There are 40 children.', 'How many children are there?'],
      answer: 'There are 14 children.',
    },
    { type: 'speak', items: [t.ilya, t.vingt], target: 'Il y a vingt personnes.', native: 'There are twenty people.' },
    {
      type: 'respond',
      items: [t.treize],
      situation: "At the museum desk, you're asked how many people are in your group. There are thirteen of you.",
      partner: { speaker: "L'agent", target: 'Vous êtes combien ?', native: 'How many of you are there?' },
      answers: ['Nous sommes treize.'],
      slots: [{ label: 'say thirteen', any: ['treize', '13'] }],
    },
  ]),
}

/* ------------------------------------------------------------------ */
/* Lesson 2: Les dizaines                                              */
/* ------------------------------------------------------------------ */

const d = defineItems('fr.u2.l2', {
  vingtetun: {
    kind: 'word',
    target: 'vingt et un',
    native: 'twenty-one',
    accept: ['vingt-et-un'],
    acceptNative: ['21'],
    note: 'Et appears with 21, 31, 41, 51, 61 and 71. Other compounds use a hyphen: vingt-deux.',
  },
  trente: { kind: 'word', target: 'trente', native: 'thirty', acceptNative: ['30'], examples: [{ target: "J'ai trente ans.", native: "I'm thirty." }] },
  quarante: { kind: 'word', target: 'quarante', native: 'forty', acceptNative: ['40'] },
  cinquante: { kind: 'word', target: 'cinquante', native: 'fifty', acceptNative: ['50'] },
  soixante: { kind: 'word', target: 'soixante', native: 'sixty', acceptNative: ['60'] },
  soixantedix: {
    kind: 'word',
    target: 'soixante-dix',
    native: 'seventy',
    acceptNative: ['70'],
    note: 'Literally "sixty-ten". 71 is soixante et onze, 75 is soixante-quinze.',
  },
  quatrevingts: {
    kind: 'word',
    target: 'quatre-vingts',
    native: 'eighty',
    acceptNative: ['80'],
    note: 'Literally "four twenties". It loses its -s when another number follows: quatre-vingt-un.',
  },
  quatrevingtdix: { kind: 'word', target: 'quatre-vingt-dix', native: 'ninety', acceptNative: ['90'] },
  cent: { kind: 'word', target: 'cent', native: 'a hundred', acceptNative: ['100', 'one hundred', 'hundred'], examples: [{ target: 'Le cours coûte cent euros.', native: 'The course costs a hundred euros.' }] },
  jai: {
    kind: 'pattern',
    target: "j'ai",
    native: 'I have',
    examples: [{ target: "J'ai trois enfants.", native: 'I have three children.' }],
  },
  quelage: {
    kind: 'phrase',
    target: 'quel âge avez-vous ?',
    native: 'how old are you? (formal)',
    accept: ['vous avez quel âge'],
    acceptNative: ['how old are you'],
    register: 'formal',
    examples: [{ target: 'Quel âge avez-vous, madame ?', native: 'How old are you, madam?' }],
  },
  jaiansage: {
    kind: 'phrase',
    target: "j'ai trente ans",
    native: "I'm thirty (years old)",
    acceptNative: ["i'm thirty", 'i am thirty', 'i am thirty years old'],
    note: 'French uses avoir (to have) for age, and ans (years) is never left out.',
    examples: [{ target: "Moi, j'ai trente ans.", native: "Me, I'm thirty." }],
  },
})

const lesson2: Lesson = {
  id: 'fr.u2.l2',
  kind: 'lesson',
  title: 'Les dizaines',
  subtitle: 'Tens to a Hundred, and Saying Your Age',
  objectives: [
    'Count in tens to a hundred, and build numbers in between.',
    'Understand prices and phone numbers read in pairs.',
    "Ask someone's age and give yours.",
  ],
  canDo: ['a1.numbers', 'a1.personal'],
  minutes: 14,
  items: Object.values(d),
  dialogue: {
    id: 'fr.u2.l2.d',
    title: "L'inscription",
    setting: 'Sarah signs up for an evening French course at a language school in Lyon.',
    speakers: { sec: { name: 'La secrétaire', voice: 'a' }, sarah: { name: 'Sarah', voice: 'b' } },
    lines: [
      { speaker: 'sec', target: "Bonjour. C'est pour l'inscription ?", native: "Hello. Is it to sign up?" },
      { speaker: 'sarah', target: "Oui. Je m'appelle Sarah Wilson.", native: 'Yes. My name is Sarah Wilson.' },
      { speaker: 'sec', target: 'Quel âge avez-vous, madame ?', native: 'How old are you, madam?' },
      { speaker: 'sarah', target: "J'ai trente-quatre ans.", native: "I'm thirty-four." },
      { speaker: 'sec', target: 'Trente-quatre ans. Et votre numéro de téléphone ?', native: 'Thirty-four. And your phone number?' },
      {
        speaker: 'sarah',
        target: "C'est le zéro six, vingt-deux, quarante-cinq, soixante-dix-huit, quatre-vingt-dix.",
        native: "It's 06 22 45 78 90.",
      },
      { speaker: 'sec', target: 'Merci. Le cours coûte cent euros.', native: 'Thank you. The course costs a hundred euros.' },
    ],
  },
  notes: [
    {
      id: 'fr.u2.l2.n1',
      title: 'Building numbers',
      body: [
        'The tens to sixty are regular. Fill in the gaps with a hyphen: *trente-deux*, *quarante-cinq*. For the ones, add *et*: *trente et un*, *cinquante et un*.',
        'French phone numbers are read in pairs: 06 22 45 78 90 is *zéro six, vingt-deux, quarante-cinq, soixante-dix-huit, quatre-vingt-dix*.',
      ],
      table: {
        rows: [
          ['20 vingt', '21 vingt et un', '22 vingt-deux'],
          ['30 trente', '31 trente et un', '35 trente-cinq'],
          ['40 quarante', '50 cinquante', '60 soixante'],
        ],
      },
    },
    {
      id: 'fr.u2.l2.n2',
      title: 'Seventy to a hundred',
      body: [
        'From seventy, French counts in twenties. Seventy is "sixty-ten", eighty is "four twenties", ninety is "four twenties ten".',
        'So the teens come back: *soixante-dix-sept* is 77, *quatre-vingt-quinze* is 95.',
      ],
      table: {
        rows: [
          ['70 soixante-dix', '71 soixante et onze'],
          ['80 quatre-vingts', '81 quatre-vingt-un'],
          ['90 quatre-vingt-dix', '99 quatre-vingt-dix-neuf'],
          ['100 cent', ''],
        ],
      },
    },
    {
      id: 'fr.u2.l2.n3',
      title: 'Age with avoir',
      body: [
        'English says "I am thirty"; French says "I have thirty years": *j\'ai trente ans*. Leaving out *ans* sounds incomplete.',
        '*Avoir* (to have) is irregular, like *être*.',
      ],
      table: {
        rows: [
          ["j'ai", 'I have'],
          ['tu as', 'you have (informal)'],
          ['il a / elle a', 'he has / she has'],
          ['vous avez', 'you have (formal)'],
        ],
      },
    },
  ],
  culture: {
    title: 'Septante and nonante',
    body: [
      'In Belgium and French-speaking Switzerland, people say septante (70) and nonante (90). In parts of Switzerland you will also hear huitante (80). Everyone understands the France forms, and in France you will only hear those.',
    ],
  },
  exercises: steps('fr.u2.l2', [
    { type: 'dialogue' },
    { type: 'present', items: [d.vingtetun, d.trente, d.quarante, d.cinquante, d.soixante] },
    { type: 'note', noteId: 'fr.u2.l2.n1' },
    { type: 'listen-choose', items: [d.quarante], audio: 'quarante', options: ['40', '14', '4', '50'], answer: '40' },
    { type: 'type', items: [d.cinquante], prompt: '50', answers: ['cinquante'] },
    { type: 'type', items: [d.trente], prompt: '30', answers: ['trente'] },
    { type: 'listen-choose', items: [d.soixante], audio: 'soixante', options: ['60', '70', '6', '16'], answer: '60' },
    { type: 'type', items: [d.vingtetun], prompt: '21', answers: ['vingt et un', 'vingt-et-un'] },
    { type: 'present', items: [d.soixantedix, d.quatrevingts, d.quatrevingtdix, d.cent] },
    { type: 'note', noteId: 'fr.u2.l2.n2' },
    { type: 'listen-choose', items: [d.quatrevingts], audio: 'quatre-vingts', options: ['80', '24', '4', '90'], answer: '80' },
    { type: 'type', items: [d.soixantedix], prompt: '70', answers: ['soixante-dix'] },
    { type: 'listen-choose', items: [d.quatrevingtdix], audio: 'quatre-vingt-dix', options: ['90', '70', '80', '19'], answer: '90' },
    {
      type: 'dictation',
      items: [d.cent],
      audio: 'Le cours coûte cent euros.',
      translation: 'The course costs a hundred euros.',
      answers: ['le cours coûte cent euros', 'le cours coûte 100 euros'],
    },
    { type: 'present', items: [d.jai, d.quelage, d.jaiansage] },
    { type: 'note', noteId: 'fr.u2.l2.n3' },
    {
      type: 'choose',
      items: [d.jai],
      prompt: "j'ai",
      promptLang: 'target',
      options: ['I have', 'I am', 'you have', 'she has'],
      answer: 'I have',
    },
    {
      type: 'gap',
      items: [d.jaiansage],
      sentence: "J'ai trente ___.",
      translation: "I'm thirty.",
      options: ['ans', 'années', 'euros', 'heures'],
      answer: 'ans',
    },
    {
      type: 'choose',
      items: [d.quelage],
      prompt: 'How old are you? (formal)',
      promptLang: 'native',
      options: ['Quel âge avez-vous ?', 'Vous êtes quel âge ?', 'Vous avez combien ?', 'Quel âge as-tu ?'],
      answer: 'Quel âge avez-vous ?',
    },
    { type: 'type', items: [d.jaiansage, d.quarante], prompt: "I'm forty.", answers: ["j'ai quarante ans"] },
    {
      type: 'listen-choose',
      items: [d.cinquante],
      audio: "J'ai cinquante-cinq ans.",
      options: ["I'm 55.", "I'm 45.", "I'm 65.", "I'm 15."],
      answer: "I'm 55.",
    },
    {
      type: 'build',
      items: [d.quelage],
      prompt: 'How old are you? (formal)',
      answer: ['Quel', 'âge', 'avez-vous ?'],
      distractors: ['êtes-vous ?', 'combien'],
    },
    { type: 'speak', items: [d.quelage], target: 'Quel âge avez-vous ?', native: 'How old are you?' },
    {
      type: 'respond',
      items: [d.jaiansage],
      situation: 'The secretary asks your age. Answer in a full sentence.',
      partner: { speaker: 'La secrétaire', target: 'Quel âge avez-vous ?', native: 'How old are you?' },
      answers: ["J'ai trente ans."],
      slots: [
        { label: "start with j'ai", any: ["j'ai"] },
        { label: 'finish with ans', any: ['ans'] },
      ],
    },
  ]),
}

/* ------------------------------------------------------------------ */
/* Lesson 3: Quelle heure est-il ?                                     */
/* ------------------------------------------------------------------ */

const h = defineItems('fr.u2.l3', {
  quelleheure: {
    kind: 'phrase',
    target: 'quelle heure est-il ?',
    native: 'what time is it?',
    accept: ['il est quelle heure'],
    examples: [{ target: 'Excusez-moi, quelle heure est-il ?', native: 'Excuse me, what time is it?' }],
  },
  heures: {
    kind: 'pattern',
    target: 'il est trois heures',
    native: "it's three o'clock",
    acceptNative: ['it is three', "it's three", "it is three o'clock"],
    note: 'Heure is singular only for one: il est une heure, il est deux heures.',
    examples: [{ target: 'Il est trois heures, on y va ?', native: "It's three o'clock, shall we go?" }],
  },
  midi: { kind: 'word', target: 'midi', native: 'midday', acceptNative: ['noon', '12 pm'], examples: [{ target: 'On mange à midi.', native: 'We eat at midday.' }] },
  minuit: { kind: 'word', target: 'minuit', native: 'midnight', acceptNative: ['12 am'], examples: [{ target: 'Il est minuit !', native: "It's midnight!" }] },
  etquart: { kind: 'phrase', target: 'et quart', native: 'quarter past', examples: [{ target: 'Il est neuf heures et quart.', native: "It's quarter past nine." }] },
  etdemie: {
    kind: 'phrase',
    target: 'et demie',
    native: 'half past',
    note: 'After midi and minuit, write et demi without the -e.',
    examples: [{ target: 'Il est dix heures et demie.', native: "It's half past ten." }],
  },
  moinslequart: {
    kind: 'phrase',
    target: 'moins le quart',
    native: 'quarter to',
    note: 'Count back from the next hour: 4:45 is cinq heures moins le quart.',
    examples: [{ target: 'Il est cinq heures moins le quart.', native: "It's quarter to five." }],
  },
  aquelleheure: {
    kind: 'phrase',
    target: 'à quelle heure ?',
    native: 'at what time?',
    acceptNative: ['what time', 'when'],
    examples: [{ target: 'Le déjeuner, c’est à quelle heure ?', native: 'What time is lunch?' }],
  },
  commence: {
    kind: 'pattern',
    target: 'ça commence à',
    native: 'it starts at',
    accept: ['il commence à', 'elle commence à'],
    examples: [{ target: 'Ça commence à huit heures.', native: 'It starts at eight o’clock.' }],
  },
  dumatin: { kind: 'phrase', target: 'du matin', native: 'in the morning', acceptNative: ['am', 'a.m.'], examples: [{ target: 'Il est sept heures du matin.', native: "It's seven in the morning." }] },
  dusoir: { kind: 'phrase', target: 'du soir', native: 'in the evening', acceptNative: ['pm', 'p.m.', 'at night'], examples: [{ target: 'Il est huit heures du soir.', native: "It's eight in the evening." }] },
})

const lesson3: Lesson = {
  id: 'fr.u2.l3',
  kind: 'lesson',
  title: 'Quelle heure est-il ?',
  subtitle: 'Telling the Time and Timetables',
  objectives: [
    'Ask the time and tell it, including quarters and halves.',
    'Ask when something starts, and understand the answer.',
    'Follow times on the 24-hour clock, as used in schedules.',
  ],
  canDo: ['a1.numbers', 'a1.announce'],
  minutes: 14,
  items: Object.values(h),
  dialogue: {
    id: 'fr.u2.l3.d',
    title: 'Le programme de la journée',
    setting: 'Morning at the conference. Sarah checks the day\'s timetable with Hugo.',
    speakers: { sarah: { name: 'Sarah', voice: 'b' }, hugo: { name: 'Hugo', voice: 'a', pitch: 0.8 } },
    lines: [
      { speaker: 'sarah', target: 'Hugo, quelle heure est-il ?', native: 'Hugo, what time is it?' },
      { speaker: 'hugo', target: 'Il est neuf heures et quart.', native: "It's quarter past nine." },
      { speaker: 'sarah', target: "Et l'atelier commence à quelle heure ?", native: 'And what time does the workshop start?' },
      { speaker: 'hugo', target: 'À dix heures et demie, dans la salle quatre.', native: 'At half past ten, in room four.' },
      { speaker: 'sarah', target: 'Et le déjeuner ?', native: 'And lunch?' },
      { speaker: 'hugo', target: 'À midi. Et ce soir, le concert commence à vingt heures.', native: 'At midday. And tonight, the concert starts at 20:00.' },
      { speaker: 'sarah', target: 'Vingt heures… huit heures du soir ?', native: 'Twenty hundred… eight in the evening?' },
      { speaker: 'hugo', target: "Oui, c'est ça !", native: "Yes, that's right!" },
    ],
  },
  notes: [
    {
      id: 'fr.u2.l3.n1',
      title: 'Quarters and halves',
      body: [
        'Start with *il est* and the hour, then add the minutes: *il est neuf heures et quart* (9:15), *il est neuf heures et demie* (9:30).',
        'For a quarter to, count back from the next hour: *il est dix heures moins le quart* (9:45).',
      ],
      table: {
        rows: [
          ['9:00', 'neuf heures'],
          ['9:15', 'neuf heures et quart'],
          ['9:30', 'neuf heures et demie'],
          ['9:45', 'dix heures moins le quart'],
          ['12:00', 'midi'],
        ],
      },
    },
    {
      id: 'fr.u2.l3.n2',
      title: 'The 24-hour clock',
      body: [
        'Timetables, announcements and invitations use the 24-hour clock, with minutes as plain numbers: *quatorze heures trente* (14:30). It is often written 14 h 30.',
        'In conversation people also use the 12-hour clock, adding *du matin* or *du soir* when it isn\'t obvious: *huit heures du soir*.',
        'To say when something happens, use *à*: *ça commence à vingt heures*.',
      ],
    },
  ],
  culture: {
    title: 'Mealtimes',
    body: [
      'Lunch in France is commonly between midday and two, and many small shops and offices close for part of it. Dinner usually starts later than in Australia or the UK, often around eight in the evening.',
    ],
  },
  exercises: steps('fr.u2.l3', [
    { type: 'dialogue' },
    { type: 'present', items: [h.quelleheure, h.heures, h.midi, h.minuit] },
    {
      type: 'listen-choose',
      items: [h.heures],
      audio: 'Il est trois heures.',
      options: ["It's 3:00.", "It's 2:00.", "It's 13:00.", "It's 3:30."],
      answer: "It's 3:00.",
    },
    { type: 'type', items: [h.midi], prompt: "It's midday.", answers: ['il est midi'] },
    { type: 'present', items: [h.etquart, h.etdemie, h.moinslequart] },
    { type: 'note', noteId: 'fr.u2.l3.n1' },
    {
      type: 'listen-choose',
      items: [h.etdemie],
      audio: 'Il est dix heures et demie.',
      options: ['10:30', '10:15', '9:30', '10:45'],
      answer: '10:30',
    },
    {
      type: 'gap',
      items: [h.etquart],
      sentence: 'Il est huit heures ___.',
      translation: "It's quarter past eight.",
      options: ['et quart', 'et demie', 'moins le quart', 'du soir'],
      answer: 'et quart',
    },
    {
      type: 'choose',
      items: [h.moinslequart],
      prompt: "It's quarter to five.",
      promptLang: 'native',
      options: [
        'Il est cinq heures moins le quart.',
        'Il est quatre heures moins le quart.',
        'Il est cinq heures et quart.',
        'Il est quatre heures et quart.',
      ],
      answer: 'Il est cinq heures moins le quart.',
    },
    { type: 'present', items: [h.aquelleheure, h.commence, h.dumatin, h.dusoir] },
    { type: 'note', noteId: 'fr.u2.l3.n2' },
    {
      type: 'gap',
      items: [h.commence],
      before: { speaker: 'Sarah', target: 'Le concert commence à quelle heure ?', native: 'What time does the concert start?' },
      sentence: 'Il commence ___ vingt heures.',
      translation: 'It starts at 20:00.',
      options: ['à', 'de', 'en', 'au'],
      answer: 'à',
    },
    {
      type: 'listen-choose',
      items: [h.dumatin],
      audio: 'à sept heures du matin',
      options: ['at 7 am', 'at 7 pm', 'at 17:00', 'at 7:30'],
      answer: 'at 7 am',
    },
    { type: 'type', items: [h.quelleheure], prompt: 'What time is it?', answers: ['quelle heure est-il ?'] },
    {
      type: 'build',
      items: [h.commence, h.dusoir],
      prompt: 'It starts at nine in the evening.',
      answer: ['Ça', 'commence', 'à', 'neuf', 'heures', 'du', 'soir.'],
      distractors: ['matin.', 'de'],
    },
    { type: 'dictation', items: [h.minuit], audio: 'Il est minuit.', translation: "It's midnight.", answers: ['il est minuit'] },
    { type: 'type', items: [h.aquelleheure], prompt: 'At what time?', answers: ['à quelle heure ?'] },
    {
      type: 'listen-choose',
      items: [h.heures],
      audio: 'Le train part à quatorze heures.',
      options: ['2 pm', '4 pm', '12 pm', '14 minutes'],
      answer: '2 pm',
    },
    { type: 'speak', items: [h.etquart], target: 'Il est neuf heures et quart.', native: "It's quarter past nine." },
    {
      type: 'respond',
      items: [h.etdemie],
      situation: "A colleague asks the time. It's 10:30. Tell her.",
      partner: { speaker: 'Inès', target: 'Quelle heure est-il ?', native: 'What time is it?' },
      answers: ['Il est dix heures et demie.'],
      slots: [
        { label: 'start with il est', any: ['il est'] },
        { label: 'say half past ten', any: ['dix heures et demie', 'dix heures trente'] },
      ],
    },
  ]),
}

/* ------------------------------------------------------------------ */
/* Lesson 4: Les jours de la semaine                                   */
/* ------------------------------------------------------------------ */

const w = defineItems('fr.u2.l4', {
  lundi: { kind: 'word', target: 'lundi', native: 'Monday', examples: [{ target: 'Le cours commence lundi.', native: 'The course starts on Monday.' }] },
  mardi: { kind: 'word', target: 'mardi', native: 'Tuesday', examples: [{ target: 'Mardi, ça va ?', native: 'Is Tuesday OK?' }] },
  mercredi: { kind: 'word', target: 'mercredi', native: 'Wednesday', examples: [{ target: 'À mercredi !', native: 'See you Wednesday!' }] },
  jeudi: { kind: 'word', target: 'jeudi', native: 'Thursday', examples: [{ target: "Aujourd'hui, on est jeudi.", native: "Today it's Thursday." }] },
  vendredi: { kind: 'word', target: 'vendredi', native: 'Friday', examples: [{ target: 'Demain, vendredi ?', native: 'Tomorrow, Friday?' }] },
  samedi: { kind: 'word', target: 'samedi', native: 'Saturday', examples: [{ target: 'Tu es libre samedi ?', native: 'Are you free on Saturday?' }] },
  dimanche: { kind: 'word', target: 'dimanche', native: 'Sunday', examples: [{ target: 'Le musée est ouvert le dimanche.', native: 'The museum is open on Sundays.' }] },
  weekend: {
    kind: 'phrase',
    target: 'le week-end',
    native: 'the weekend',
    accept: ['le weekend'],
    acceptNative: ['weekend', 'at the weekend', 'on the weekend'],
    examples: [{ target: 'Le week-end, je suis à Paris.', native: "At the weekend, I'm in Paris." }],
  },
  aujourdhui: {
    kind: 'word',
    target: "aujourd'hui",
    native: 'today',
    examples: [{ target: "Aujourd'hui, il y a un concert.", native: "Today there's a concert." }],
  },
  demain: { kind: 'word', target: 'demain', native: 'tomorrow', examples: [{ target: 'Le cours, c’est demain.', native: 'The class is tomorrow.' }] },
  hier: { kind: 'word', target: 'hier', native: 'yesterday', note: 'Pronounced "yair".' },
  cesoir: { kind: 'phrase', target: 'ce soir', native: 'this evening', acceptNative: ['tonight'], examples: [{ target: 'Tu es libre ce soir ?', native: 'Are you free tonight?' }] },
  quel: {
    kind: 'phrase',
    target: 'on est quel jour ?',
    native: 'what day is it?',
    accept: ["on est quel jour aujourd'hui", 'quel jour sommes-nous'],
    acceptNative: ['what day is it today'],
    note: 'Answer with on est and the day: on est mardi.',
    examples: [{ target: "On est quel jour aujourd'hui ?", native: 'What day is it today?' }],
  },
  ademain: { kind: 'phrase', target: 'à demain', native: 'see you tomorrow', examples: [{ target: 'Merci, à demain !', native: 'Thanks, see you tomorrow!' }] },
})

const lesson4: Lesson = {
  id: 'fr.u2.l4',
  kind: 'lesson',
  title: 'Les jours de la semaine',
  subtitle: 'Days, Today and Tomorrow, Making Plans',
  objectives: [
    'Name the days of the week.',
    'Say what day it is, and talk about today, tomorrow and tonight.',
    'Suggest a day and agree on a plan.',
  ],
  canDo: ['a1.personal', 'a1.familiar'],
  minutes: 12,
  items: Object.values(w),
  dialogue: {
    id: 'fr.u2.l4.d',
    title: 'Tu es libre ?',
    setting: 'Léa, a friend from the conference, wants to meet up with Sarah.',
    speakers: { lea: { name: 'Léa', voice: 'a' }, sarah: { name: 'Sarah', voice: 'b' } },
    lines: [
      { speaker: 'lea', target: "Salut ! On est quel jour aujourd'hui ?", native: 'Hi! What day is it today?' },
      { speaker: 'sarah', target: "Aujourd'hui, on est jeudi.", native: "Today it's Thursday." },
      { speaker: 'lea', target: 'Ah oui ! Tu es libre ce soir ?', native: 'Oh yes! Are you free tonight?' },
      { speaker: 'sarah', target: 'Non, ce soir, il y a le concert. Et demain ?', native: "No, tonight there's the concert. What about tomorrow?" },
      { speaker: 'lea', target: 'Demain, vendredi ? Oui ! On mange ensemble à midi ?', native: 'Tomorrow, Friday? Yes! Shall we have lunch together at midday?' },
      { speaker: 'sarah', target: 'Parfait. À demain !', native: 'Perfect. See you tomorrow!' },
      { speaker: 'lea', target: 'À demain !', native: 'See you tomorrow!' },
    ],
  },
  notes: [
    {
      id: 'fr.u2.l4.n1',
      title: 'Days of the week',
      body: [
        'Days are not capitalised in French: *lundi*, *mardi*.',
        'No word for "on" is needed: *je suis libre samedi* (I\'m free on Saturday). With *le*, it means every week: *le samedi* (on Saturdays).',
        'To say what day it is, use *on est*: *on est mardi*.',
      ],
      table: {
        rows: [
          ['lundi', 'Monday'],
          ['mardi', 'Tuesday'],
          ['mercredi', 'Wednesday'],
          ['jeudi', 'Thursday'],
          ['vendredi', 'Friday'],
          ['samedi', 'Saturday'],
          ['dimanche', 'Sunday'],
        ],
      },
    },
  ],
  culture: {
    title: 'Sunday closing',
    body: [
      'French calendars start the week on Monday. Many shops close on Sunday, especially outside big cities and tourist areas, and some small shops also close on Monday. Bakeries are often open on Sunday morning.',
    ],
  },
  exercises: steps('fr.u2.l4', [
    { type: 'dialogue' },
    { type: 'present', items: [w.lundi, w.mardi, w.mercredi, w.jeudi] },
    { type: 'listen-choose', items: [w.mercredi], audio: 'mercredi', options: ['Wednesday', 'Monday', 'Tuesday', 'Thursday'], answer: 'Wednesday' },
    { type: 'type', items: [w.lundi], prompt: 'Monday', answers: ['lundi'] },
    { type: 'present', items: [w.vendredi, w.samedi, w.dimanche, w.weekend] },
    { type: 'note', noteId: 'fr.u2.l4.n1' },
    { type: 'type', items: [w.samedi], prompt: 'Saturday', answers: ['samedi'] },
    { type: 'listen-choose', items: [w.dimanche], audio: 'dimanche', options: ['Sunday', 'Saturday', 'Monday', 'Friday'], answer: 'Sunday' },
    { type: 'present', items: [w.aujourdhui, w.demain, w.hier, w.cesoir, w.quel, w.ademain] },
    {
      type: 'choose',
      items: [w.quel],
      prompt: 'What day is it today?',
      promptLang: 'native',
      options: ["On est quel jour aujourd'hui ?", 'Quelle heure est-il ?', 'À quelle heure ?', "C'est combien ?"],
      answer: "On est quel jour aujourd'hui ?",
    },
    {
      type: 'gap',
      items: [w.mardi, w.demain],
      sentence: "Aujourd'hui, on est lundi. Demain, on est ___.",
      translation: 'Today is Monday. Tomorrow is Tuesday.',
      options: ['mardi', 'dimanche', 'mercredi', 'jeudi'],
      answer: 'mardi',
    },
    { type: 'type', items: [w.demain], prompt: 'tomorrow', answers: ['demain'] },
    {
      type: 'gap',
      items: [w.cesoir],
      sentence: 'Tu es libre ___ ?',
      translation: 'Are you free tonight?',
      options: ['ce soir', 'hier', "aujourd'hui soir", 'du soir'],
      answer: 'ce soir',
    },
    {
      type: 'build',
      items: [w.aujourdhui, w.vendredi],
      prompt: 'Today is Friday.',
      answer: ["Aujourd'hui,", 'on', 'est', 'vendredi.'],
      distractors: ['samedi.', 'demain'],
    },
    {
      type: 'dictation',
      items: [w.weekend],
      audio: "Le week-end, c'est samedi et dimanche.",
      translation: 'The weekend is Saturday and Sunday.',
      answers: ["le week-end, c'est samedi et dimanche"],
    },
    { type: 'type', items: [w.hier], prompt: 'yesterday', answers: ['hier'] },
    { type: 'type', items: [w.jeudi], prompt: 'Thursday', answers: ['jeudi'] },
    { type: 'type', items: [w.ademain], prompt: 'See you tomorrow!', answers: ['à demain !'] },
    { type: 'speak', items: [w.aujourdhui, w.mercredi], target: "Aujourd'hui, on est mercredi.", native: "Today it's Wednesday." },
    {
      type: 'respond',
      items: [w.dimanche],
      situation: "A friend asks if you're free on Saturday. You're not, but suggest Sunday instead.",
      partner: { speaker: 'Léa', target: 'Tu es libre samedi ?', native: 'Are you free on Saturday?' },
      answers: ['Non, mais dimanche, oui !'],
      slots: [
        { label: 'say no', any: ['non'] },
        { label: 'suggest Sunday', any: ['dimanche'] },
      ],
    },
  ]),
}

/* ------------------------------------------------------------------ */
/* Checkpoint                                                          */
/* ------------------------------------------------------------------ */

const checkpoint: Lesson = {
  id: 'fr.u2.check',
  kind: 'checkpoint',
  title: 'Bilan : les chiffres et le temps',
  subtitle: 'Unit Check',
  objectives: ['Show you can handle numbers, times and days in real exchanges.', 'Score 80% or more to mark this unit as demonstrated.'],
  canDo: ['a1.numbers', 'a1.personal', 'a1.announce'],
  minutes: 10,
  items: [],
  notes: [],
  exercises: steps('fr.u2.check', [
    {
      type: 'listen-choose',
      items: [h.heures],
      audio: 'Il est quatorze heures quinze.',
      options: ['2:15 pm', '4:15 pm', '2:50 pm', '12:15 pm'],
      answer: '2:15 pm',
    },
    { type: 'type', items: [d.soixantedix, t.quinze], prompt: '75', answers: ['soixante-quinze'] },
    {
      type: 'dictation',
      items: [t.ilya, t.dixsept],
      audio: 'Il y a dix-sept enfants.',
      translation: 'There are seventeen children.',
      answers: ['il y a dix-sept enfants', 'il y a 17 enfants'],
    },
    {
      type: 'gap',
      items: [h.etdemie, h.midi],
      sentence: 'Il est midi et ___.',
      translation: "It's half past twelve (midday).",
      options: ['demi', 'quart moins', 'heures', 'soir'],
      answer: 'demi',
    },
    {
      type: 'respond',
      items: [w.dimanche],
      situation: "A friend asks what day it is. It's Sunday.",
      partner: { speaker: 'Hugo', target: "On est quel jour aujourd'hui ?", native: 'What day is it today?' },
      answers: ["Aujourd'hui, on est dimanche."],
      slots: [{ label: 'say Sunday', any: ['dimanche'] }],
    },
    {
      type: 'choose',
      items: [t.combiende],
      prompt: 'How many people are there?',
      promptLang: 'native',
      options: ['Il y a combien de personnes ?', 'Il y a des personnes ?', 'Combien ça coûte ?', 'Quelle heure est-il ?'],
      answer: 'Il y a combien de personnes ?',
    },
    {
      type: 'listen-choose',
      items: [d.soixante],
      audio: "J'ai soixante-huit ans.",
      options: ['68', '78', '88', '48'],
      answer: '68',
    },
    {
      type: 'type',
      items: [h.commence, h.aquelleheure],
      prompt: 'What time does it start?',
      answers: ['ça commence à quelle heure ?', 'à quelle heure ça commence ?'],
    },
    {
      type: 'build',
      items: [w.samedi],
      prompt: "See you on Saturday at ten o'clock!",
      answer: ['À', 'samedi', 'à', 'dix', 'heures !'],
      distractors: ['au', 'demain'],
    },
    {
      type: 'type',
      items: [h.moinslequart, h.dusoir],
      prompt: "It's quarter to nine in the evening.",
      answers: ['il est neuf heures moins le quart du soir', 'il est vingt heures quarante-cinq'],
    },
    {
      type: 'speak',
      items: [w.lundi, h.commence],
      target: 'Le cours commence lundi à neuf heures.',
      native: 'The course starts on Monday at nine.',
    },
    {
      type: 'respond',
      items: [h.etdemie, h.midi],
      situation: 'A friend asks what time lunch is. It is at 12:30.',
      partner: { speaker: 'Léa', target: "Le déjeuner, c'est à quelle heure ?", native: 'What time is lunch?' },
      answers: ["C'est à midi et demi."],
      slots: [{ label: 'say half past twelve', any: ['midi et demi', 'midi et demie', 'midi trente', 'douze heures trente'] }],
    },
  ]),
}

export const unit2: Unit = {
  id: 'fr.u2',
  level: 'A1',
  title: 'Les chiffres et le temps',
  subtitle: 'Numbers to a Hundred, Telling the Time, Days of the Week',
  lessons: [lesson1, lesson2, lesson3, lesson4, checkpoint],
}

export const unit2Items = { t, d, h, w }
