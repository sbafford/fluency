import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 1's exercises.
export const explain1: Record<string, Explanation> = {
  'fr.u1.l1.s3': {
    because: "*Bonsoir* is good evening. *Soir* means evening, so switch from *bonjour* to *bonsoir* in the early evening, from about 6 pm.",
    why: {
      'good morning': "Good morning is simply *bonjour*, which you use all day until the evening.",
      goodbye: "Goodbye is *au revoir*. *Bonsoir* is said when you arrive in the evening.",
      'see you soon': "See you soon is *à bientôt*.",
    },
  },
  'fr.u1.l1.s4': {
    because: "*Au revoir* is the everyday way to say goodbye, polite enough for shops and strangers.",
    why: {
      'Good evening!': "Good evening would be *Bonsoir !*, one word starting with a clear *b*.",
      'See you soon!': "See you soon would be *À bientôt !*, ending in a 'tow' sound.",
      'Hi!': "Hi would be *Salut !*, short and only for friends.",
    },
  },
  'fr.u1.l1.s7': {
    because: "With someone you have just met, use *vous*: *Comment allez-vous ?* is the polite way to ask how they are.",
    why: {
      'Ça va ?': "*Ça va ?* also asks how you are, but it's casual, for friends and family.",
      'Et toi ?': "*Et toi ?* means and you?, informal. It follows an answer rather than opening the question.",
      'Salut !': "*Salut !* means hi or bye, and only with friends.",
    },
  },
  'fr.u1.l1.s8': {
    because: "Camille used *vous*, so you answer in kind: *Et vous ?* keeps the same polite register.",
    why: {
      toi: "*Et toi ?* is the informal version. After *Comment allez-vous ?*, stay with *vous*.",
      merci: "*Merci* means thank you, already said just before. *Et merci* doesn't ask anything back.",
      bien: "*Bien* means well. *Et bien ?* isn't a way to say and you?",
    },
  },
  'fr.u1.l1.s10': {
    because: "*De rien* is the standard reply to *merci*: literally 'of nothing', it means you're welcome.",
    why: {
      merci: "*Merci* is thank you, what Léa just said. *De merci* isn't a French phrase.",
      bien: "*Bien* means well, as in *très bien*. *De bien* doesn't mean you're welcome.",
      vous: "*Vous* means you. *De vous* would mean of you, not you're welcome.",
    },
  },
  'fr.u1.l2.s3': {
    because: "*Comment vous appelez-vous ?* uses *vous*, so it's the polite way to ask someone's name.",
    why: {
      "What's your name? (informal)": "The informal version uses *tu*: *Tu t'appelles comment ?* Here you hear *vous* twice.",
      'My name is…': "My name is… would be *Je m'appelle…*, starting with *je*, not *comment*.",
      'Nice to meet you': "Nice to meet you is *Enchanté* (or *Enchantée* from a woman).",
    },
  },
  'fr.u1.l2.s4': {
    because: "*Je m'appelle* literally means 'I call myself'. You need the little *m'* before *appelle*.",
    why: {
      appelle: "Without *m'*, *j'appelle* means 'I call', like calling someone. Saying your name needs *je m'appelle*.",
      "t'appelles": "*T'appelles* goes with *tu*: *tu t'appelles*. With *je*, it's *je m'appelle*.",
      'suis appelle': "*Suis* is from *être* (to be). French doesn't add 'am' here: just *je m'appelle*.",
    },
  },
  'fr.u1.l2.s6': {
    because: "*Enchantée* means nice to meet you; the extra *-e* shows a woman is saying it.",
    why: {
      'Good evening, madam.': "That would be *Bonsoir, madame.*, starting with *bon*.",
      'Thank you, madam.': "That would be *Merci, madame.*, a short 'mair-see'.",
      'Goodbye, madam.': "That would be *Au revoir, madame.*",
    },
  },
  'fr.u1.l2.s7': {
    because: "*Bonsoir* is good evening and *monsieur* is sir, so *Bonsoir, monsieur.*",
    why: {
      'Bonsoir, madame.': "*Madame* is madam, for a woman. For a man, say *monsieur*.",
      'Bonjour, monsieur.': "*Bonjour* is hello or good morning, used until the evening. Good evening is *bonsoir*.",
      'Au revoir, monsieur.': "*Au revoir* means goodbye, not good evening.",
    },
  },
  'fr.u1.l2.s10': {
    because: "At work and with a manager, use the polite *vous*. With *vous*, *être* becomes *vous êtes*.",
    why: {
      'tu es': "*Tu es* is the informal you are, for friends and family, not usually your manager.",
      'il est': "*Il est* means he is, not you are.",
      'je suis': "*Je suis* means I am.",
    },
  },
  'fr.u1.l2.s11': {
    because: "Hugo is 'he', so *être* takes the *il* form: *Hugo est bénévole*.",
    why: {
      es: "*Es* goes with *tu*: *tu es*. For one other person, use *est*.",
      suis: "*Suis* goes with *je*: *je suis bénévole*.",
      'êtes': "*Êtes* goes with *vous*: *vous êtes bénévole*.",
    },
  },
  'fr.u1.l2.s12': {
    because: "Nathalie is a woman, so she is *elle*: *Elle est à l'accueil.*",
    why: {
      Il: "*Il* means he. For Nathalie, use *elle*.",
      Tu: "*Tu* means you, and goes with *es*: *tu es*. Here we're talking about Nathalie.",
      Je: "*Je* means I, and goes with *suis*: *je suis*.",
    },
  },
  'fr.u1.l2.s15': {
    because: "With *tu*, the verb ends in *-es*: *tu t'appelles*. The ending is silent, so listen for *tu* to know who it's about.",
    why: {
      appelez: "*Appelez* goes with *vous*: *vous vous appelez*.",
      appelle: "*Appelle* goes with *je*, *il* and *elle*: *je m'appelle*, *elle s'appelle*.",
      es: "*Es* is from *être* (to be): *tu es*. It can't follow *t'*.",
    },
  },
  'fr.u1.l2.s19': {
    because: "To point someone out and say who they are, use *c'est*: *C'est Paul* (this is Paul).",
    why: {
      'Il est': "*Il est* describes someone, as in *il est anglais*. Before a name, use *c'est*.",
      'Je suis': "*Je suis* means I am. *Je suis Paul* would mean I'm Paul.",
      'Tu es': "*Tu es* means you are, said to Paul, not introducing him.",
    },
  },
  'fr.u1.l3.s3': {
    because: "*J'habite à* means I live in, followed by a city: *j'habite à Perth*.",
    why: {
      'I come from': "I come from is *je viens de*: *je viens de Perth*.",
      'I work': "I work is *je travaille*.",
      "I'm a student": "I'm a student is *je suis étudiant*, or *étudiante* for a woman.",
    },
  },
  'fr.u1.l3.s4': {
    because: "*Venir* (to come) is followed by *de* for where you're from: *je viens de Perth*.",
    why: {
      'à': "*À* goes with *habiter*: *j'habite à Perth* means I live in Perth.",
      en: "*En* means in or to a feminine country: *j'habite en France*. To say from, use *de*: *je viens de France*.",
      au: "*Au* means in or to a masculine country: *j'habite au Canada*. From one is *du*: *je viens du Canada*.",
    },
  },
  'fr.u1.l3.s5': {
    because: "With a friend, use *tu*. *Tu viens d'où ?* puts the question word at the end, as in relaxed speech.",
    why: {
      'D\'où venez-vous ?': "Same question, but with *vous*: polite, for strangers or at work rather than a friend.",
      'Tu habites où ?': "*Tu habites où ?* asks where you live, not where you're from.",
      'Tu t\'appelles comment ?': "*Tu t'appelles comment ?* asks what your name is.",
    },
  },
  'fr.u1.l3.s8': {
    because: "A woman adds *-ne* to *australien*: *je suis australienne*. Nationalities take no capital letter in French.",
    why: {
      'Je suis australien.': "*Australien* is the form a man uses. A woman says *australienne*.",
      "J'habite en Australie.": "This means I live in Australia, which says where you live, not your nationality.",
      "Je viens d'Australie.": "This means I'm from Australia. Close, but it names the country rather than your nationality.",
    },
  },
  'fr.u1.l3.s11': {
    because: "*France* is a feminine country (it ends in *-e*), so it takes *en*: *j'habite en France*.",
    why: {
      'à': "*À* is for towns and cities: *j'habite à Paris*.",
      au: "*Au* is for masculine countries: *j'habite au Canada*.",
      de: "*De* means from: *je viens de France* (I'm from France).",
    },
  },
  'fr.u1.l3.s12': {
    because: "Londres is a city, and cities take *à*: *j'habite à Londres*.",
    why: {
      en: "*En* is for feminine countries: *j'habite en Angleterre*.",
      au: "*Au* is for masculine countries: *j'habite au Canada*.",
      de: "*De* means from: *je viens de Londres* (I'm from London).",
    },
  },
  'fr.u1.l3.s14': {
    because: "*Qu'est-ce que vous faites ?* means 'what do you do?', the usual way to ask about someone's job.",
    why: {
      'Where are you from?': "That would be *D'où venez-vous ?*, with *venez*, not *faites*.",
      'Where do you live?': "That would be *Où habitez-vous ?* or *Vous habitez où ?*",
      "What's your name?": "That would be *Comment vous appelez-vous ?*",
    },
  },
  'fr.u1.l3.s15': {
    because: "With *je*, the verb ends in *-e*: *je travaille*, I work.",
    why: {
      travailles: "*Travailles* goes with *tu*: *tu travailles*. It sounds the same, but the spelling changes.",
      suis: "*Suis* means am. *Je suis à Paris* means I'm in Paris, not I work there.",
      viens: "*Viens* is from *venir*: *je viens* means I come.",
    },
  },
  'fr.u1.l3.s22': {
    because: "*D'où venez-vous ?* means where are you from? *D'où* is from where, and *venez* is from *venir* (to come).",
    why: {
      'Where do you live?': "That would be *Où habitez-vous ?*, with *habitez*.",
      'What do you do?': "That would be *Qu'est-ce que vous faites ?*",
      'How are you?': "That would be *Comment allez-vous ?*",
    },
  },
  'fr.u1.l4.s4': {
    because: "*Je voudrais* (I'd like) is the polite way to order or ask for something.",
    why: {
      veux: "*Je veux* means I want. It's correct French, but sounds blunt when ordering.",
      suis: "*Je suis* means I am. *Je suis un café* would mean I'm a coffee.",
      "m'appelle": "*Je m'appelle* means my name is, so it can't order a coffee.",
    },
  },
  'fr.u1.l4.s5': {
    because: "*Carafe* is a feminine noun, so it's *une carafe*. *D'eau* means of water.",
    why: {
      "un carafe d'eau": "*Carafe* is feminine, so it takes *une*, not *un*.",
      'une café': "*Café* is masculine: *un café*. And it's coffee, not water.",
      'un thé': "*Un thé* is a tea.",
    },
  },
  'fr.u1.l4.s7': {
    because: "*Quatre* is 4, sounding roughly like 'katr'.",
    why: {
      '5': "5 is *cinq*, which starts with an 's' sound: 'sank'.",
      '3': "3 is *trois*, 'trwah', with no 'k' sound.",
      '8': "8 is *huit*, sounding like 'weet'.",
    },
  },
  'fr.u1.l4.s8': {
    because: "*Trois* is 3, pronounced 'trwah'.",
    why: {
      '2': "2 is *deux*, a short 'deu' with no 'r'.",
      '6': "6 is *six*, 'seess' on its own.",
      '9': "9 is *neuf*, ending in an 'f' sound.",
    },
  },
  'fr.u1.l4.s13': {
    because: "*Sept* is 7. The *p* is silent, so it sounds like 'set'.",
    why: {
      '6': "6 is *six*, 'seess', with an 's' at the end rather than a 't'.",
      '10': "10 is *dix*, 'deess', starting with a 'd'.",
      '2': "2 is *deux*, 'deu', with no final consonant.",
    },
  },
  'fr.u1.l4.s14': {
    because: "*Neuf* is 9, starting with 'n' and ending in a clear 'f'.",
    why: {
      '5': "5 is *cinq*, 'sank', starting with an 's'.",
      '1': "1 is *un*, a short nasal vowel with no consonants.",
      '4': "4 is *quatre*, 'katr', starting with a 'k'.",
    },
  },
  'fr.u1.l4.s18': {
    because: "*L'addition* is the bill in a café or restaurant.",
    why: {
      'The menu, please.': "The menu would be *la carte, s'il vous plaît*.",
      'A coffee, please.': "That would be *un café, s'il vous plaît*.",
      'Here you are.': "Here you are is *voilà* (or *voici*).",
    },
  },
  'fr.u1.l4.s21': {
    because: "*Six euros* is €6. Before *euros*, *six* links with a 'z' sound: 'see-zeuro'.",
    why: {
      '€10': "€10 is *dix euros*, 'dee-zeuro', starting with 'd' instead of 's'.",
      '€3': "€3 is *trois euros*, 'trwah-zeuro'.",
      '€2': "€2 is *deux euros*, 'deu-zeuro'.",
    },
  },
  'fr.u1.check.s1': {
    because: "*Bonsoir* is good evening, and *comment allez-vous ?* asks how you are, politely.",
    why: {
      'Good morning, how are you?': "Good morning would start with *bonjour*. Listen for *soir* at the end of the greeting.",
      'Good evening, see you soon.': "See you soon is *à bientôt*. Here you hear a question: *comment allez-vous ?*",
      "Hi, what's your name?": "That would be *Salut, tu t'appelles comment ?*",
    },
  },
  'fr.u1.check.s4': {
    because: "A woman adds *-e*: *française*, so the *s* is now heard as a 'z'.",
    why: {
      'français': "*Français* is the form a man uses. A woman says *française*.",
      France: "*France* is the country. After *je suis*, use the nationality: *française*.",
      'en France': "*Je suis en France* means I'm in France, not I'm French.",
    },
  },
  'fr.u1.check.s8': {
    because: "*Huit euros* is €8. *Huit* sounds like 'weet', and links to *euros*: 'wee-teuro'.",
    why: {
      '€6': "€6 would be *six euros*, 'see-zeuro', starting with an 's'.",
      '€3': "€3 would be *trois euros*, 'trwah-zeuro'.",
      '€10': "€10 would be *dix euros*, 'dee-zeuro', starting with a 'd'.",
    },
  },
}
