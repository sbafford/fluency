import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 2's exercises.
export const explain2: Record<string, Explanation> = {
  'fr.u2.l1.s3': {
    because: "*Douze* is 12. It ends in a buzzing 'z' sound: 'dooz'.",
    why: {
      '2': "2 is *deux*, 'deu', with no 'z' at the end.",
      '20': "20 is *vingt*, sounding like 'van'.",
      '13': "13 is *treize*, 'trez', starting with 'tr'.",
    },
  },
  'fr.u2.l1.s4': {
    because: "*Quatorze* is 14: it starts like *quatre* and ends in 'orz'.",
    why: {
      '4': "4 is *quatre*, 'katr', with no 'z' ending.",
      '15': "15 is *quinze*, 'kanz', a shorter word with a nasal sound.",
      '13': "13 is *treize*, 'trez', starting with 'tr'.",
    },
  },
  'fr.u2.l1.s8': {
    because: "*Seize* is 16, sounding like 'sez', with a 'z' at the end.",
    why: {
      '6': "6 is *six*, 'seess', ending in a hissing 's' rather than a 'z'.",
      '13': "13 is *treize*, 'trez', starting with 'tr'.",
      '19': "19 is *dix-neuf*, 'deez-nuhf', two parts: ten and nine.",
    },
  },
  'fr.u2.l1.s10': {
    because: "*Dix-neuf* is 19: ten plus nine, 'deez-nuhf'.",
    why: {
      '9': "9 is just *neuf*, without *dix* in front.",
      '17': "17 is *dix-sept*, 'deess-set', ending in a 't' sound.",
      '18': "18 is *dix-huit*, 'deez-weet'.",
    },
  },
  'fr.u2.l1.s15': {
    because: "*Il y a* means there is or there are, and never changes, even for many things.",
    why: {
      est: "*Est* means is, but the fixed phrase for there is is *il y a*, with *a* from *avoir*.",
      sont: "*Sont* means are, but *il y a* stays the same for plurals.",
      as: "*As* goes with *tu*: *tu as* (you have). The set phrase is *il y a*.",
    },
  },
  'fr.u2.l1.s16': {
    because: "*Combien de* asks how many. Before a vowel, *de* becomes *d'*: *combien d'enfants*.",
    why: {
      'Il y a trois enfants.': "This is an answer: there are three children.",
      "C'est combien ?": "*C'est combien ?* asks how much it costs.",
      'Vous êtes combien ?': "This asks how many of you there are, not how many children.",
    },
  },
  'fr.u2.l1.s19': {
    because: "*Quatorze* is 14, so *il y a quatorze enfants* means there are 14 children.",
    why: {
      'There are 4 children.': "4 would be *quatre*, 'katr'. *Quatorze* is longer, ending in 'orz'.",
      'There are 40 children.': "40 would be *quarante*, ending in a nasal 'ont' sound, not 'orz'.",
      'How many children are there?': "That would be a question with *combien*: *Il y a combien d'enfants ?*",
    },
  },
  'fr.u2.l2.s4': {
    because: "*Quarante* is 40, 'ka-ront', ending in a nasal sound.",
    why: {
      '14': "14 is *quatorze*, ending in 'orz'.",
      '4': "4 is *quatre*, 'katr', just one short syllable.",
      '50': "50 is *cinquante*, 'san-kont', starting with an 's'.",
    },
  },
  'fr.u2.l2.s7': {
    because: "*Soixante* is 60, roughly 'swa-sont'.",
    why: {
      '70': "70 is *soixante-dix*, sixty-ten, so it has *dix* on the end.",
      '6': "6 is *six*, 'seess', one short syllable.",
      '16': "16 is *seize*, 'sez'.",
    },
  },
  'fr.u2.l2.s11': {
    because: "*Quatre-vingts* is 80, literally 'four twenties'.",
    why: {
      '24': "24 is *vingt-quatre*: twenty first, then four.",
      '4': "4 is just *quatre*, without *vingts*.",
      '90': "90 is *quatre-vingt-dix*, with *dix* added on the end.",
    },
  },
  'fr.u2.l2.s13': {
    because: "*Quatre-vingt-dix* is 90: four twenties plus ten.",
    why: {
      '70': "70 is *soixante-dix*, sixty-ten.",
      '80': "80 is *quatre-vingts*, without *dix* on the end.",
      '19': "19 is *dix-neuf*, ten-nine.",
    },
  },
  'fr.u2.l2.s17': {
    because: "*J'ai* means I have. It's *je* + *ai*, from *avoir* (to have), shortened before the vowel.",
    why: {
      'I am': "I am is *je suis*, from *être*.",
      'you have': "You have is *tu as* or *vous avez*.",
      'she has': "She has is *elle a*.",
    },
  },
  'fr.u2.l2.s18': {
    because: "Age is given in *ans* (years): *j'ai trente ans*. The word *ans* is never left out.",
    why: {
      'années': "*Années* also means years, but for age French always uses *ans*.",
      euros: "*J'ai trente euros* means I have thirty euros.",
      heures: "*Heures* means hours, as in *trois heures*.",
    },
  },
  'fr.u2.l2.s19': {
    because: "Age uses *avoir*, and the polite form is *avez-vous*: *Quel âge avez-vous ?*",
    why: {
      'Vous êtes quel âge ?': "Age takes *avoir*, not *être*. You could say *Vous avez quel âge ?*",
      'Vous avez combien ?': "This asks how many you have, with no mention of age.",
      'Quel âge as-tu ?': "This is the informal version with *tu*. The formal one uses *vous*.",
    },
  },
  'fr.u2.l2.s21': {
    because: "*Cinquante-cinq* is 55: fifty, then five.",
    why: {
      "I'm 45.": "45 would be *quarante-cinq*, starting with a 'k' sound.",
      "I'm 65.": "65 would be *soixante-cinq*, starting with 'swa'.",
      "I'm 15.": "15 would be *quinze*, one short word.",
    },
  },
  'fr.u2.l3.s3': {
    because: "*Trois heures* is three o'clock: *il est* (it is), then the hour, then *heures*.",
    why: {
      "It's 2:00.": "2:00 would be *deux heures*, 'deu-zeur'.",
      "It's 13:00.": "13:00 would be *treize heures*, with a 'z' sound: 'trez'.",
      "It's 3:30.": "3:30 would add *et demie*: *trois heures et demie*.",
    },
  },
  'fr.u2.l3.s7': {
    because: "*Et demie* adds half an hour: *dix heures et demie* is 10:30.",
    why: {
      '10:15': "10:15 would be *dix heures et quart*.",
      '9:30': "9:30 would be *neuf heures et demie*.",
      '10:45': "10:45 would be *onze heures moins le quart*, counting back from eleven.",
    },
  },
  'fr.u2.l3.s8': {
    because: "*Et quart* means quarter past: *huit heures et quart* is 8:15.",
    why: {
      'et demie': "*Et demie* means half past: *huit heures et demie* is 8:30.",
      'moins le quart': "*Moins le quart* means quarter to: *huit heures moins le quart* is 7:45.",
      'du soir': "*Du soir* means in the evening: *huit heures du soir* is 8 pm.",
    },
  },
  'fr.u2.l3.s9': {
    because: "For quarter to, name the next hour and take a quarter off: 4:45 is *cinq heures moins le quart*.",
    why: {
      'Il est quatre heures moins le quart.': "This is quarter to four, 3:45. Name the hour you're heading towards: *cinq*.",
      'Il est cinq heures et quart.': "*Et quart* is quarter past, so this is 5:15.",
      'Il est quatre heures et quart.': "This is quarter past four, 4:15.",
    },
  },
  'fr.u2.l3.s12': {
    because: "To say at a time, use *à*: *il commence à vingt heures*.",
    why: {
      de: "*De* means from or of. *De vingt heures* would mean from 20:00.",
      en: "*En* is used with countries and months, not clock times.",
      au: "*Au* is for masculine countries, like *au Canada*. Times take *à*.",
    },
  },
  'fr.u2.l3.s13': {
    because: "*Du matin* means in the morning, so *à sept heures du matin* is at 7 am.",
    why: {
      'at 7 pm': "7 pm would be *sept heures du soir*. Listen for *matin* or *soir* at the end.",
      'at 17:00': "17:00 would be *dix-sept heures*.",
      'at 7:30': "7:30 would be *sept heures et demie*.",
    },
  },
  'fr.u2.l3.s18': {
    because: "*Quatorze heures* is 14:00 on the 24-hour clock, which is 2 pm.",
    why: {
      '4 pm': "4 pm would be *seize heures*, 'sez', which is 16:00.",
      '12 pm': "12 pm is *midi*, or *douze heures*.",
      '14 minutes': "*Heures* means hours. 14 minutes would be *quatorze minutes*.",
    },
  },
  'fr.u2.l4.s3': {
    because: "*Mercredi* is Wednesday, the middle of the week, starting with 'mair'.",
    why: {
      Monday: "Monday is *lundi*.",
      Tuesday: "Tuesday is *mardi*. It starts with 'm' too, but it's shorter.",
      Thursday: "Thursday is *jeudi*.",
    },
  },
  'fr.u2.l4.s8': {
    because: "*Dimanche* is Sunday, the only day that doesn't end in *-di*.",
    why: {
      Saturday: "Saturday is *samedi*.",
      Monday: "Monday is *lundi*.",
      Friday: "Friday is *vendredi*.",
    },
  },
  'fr.u2.l4.s10': {
    because: "*On est quel jour ?* asks what day it is, and *aujourd'hui* means today.",
    why: {
      'Quelle heure est-il ?': "This asks what time it is, not what day.",
      'À quelle heure ?': "This asks at what time.",
      "C'est combien ?": "This asks how much something costs.",
    },
  },
  'fr.u2.l4.s11': {
    because: "The day after *lundi* (Monday) is *mardi* (Tuesday).",
    why: {
      dimanche: "*Dimanche* is Sunday, the day before Monday.",
      mercredi: "*Mercredi* is Wednesday, two days after Monday.",
      jeudi: "*Jeudi* is Thursday.",
    },
  },
  'fr.u2.l4.s13': {
    because: "*Ce soir* means this evening or tonight.",
    why: {
      hier: "*Hier* means yesterday, which doesn't fit being free now.",
      "aujourd'hui soir": "French doesn't combine these. This evening is simply *ce soir*.",
      'du soir': "*Du soir* means in the evening after a time, as in *huit heures du soir*.",
    },
  },
  'fr.u2.check.s1': {
    because: "*Quatorze heures* is 14:00, or 2 pm, and *quinze* adds 15 minutes: 2:15 pm.",
    why: {
      '4:15 pm': "4:15 pm would be *seize heures quinze*. *Seize* is 'sez', *quatorze* is 'ka-torz'.",
      '2:50 pm': "2:50 pm would be *quatorze heures cinquante*. *Quinze* is 15, *cinquante* is 50.",
      '12:15 pm': "12:15 pm would be *midi et quart* or *douze heures quinze*.",
    },
  },
  'fr.u2.check.s4': {
    because: "After *midi* and *minuit*, half past is written *et demi*, without the *-e*.",
    why: {
      'quart moins': "The order is *moins le quart* (quarter to), and it doesn't follow *et*.",
      heures: "*Midi* already means 12 o'clock, so it never takes *heures*.",
      soir: "*Soir* means evening, and midday can't be in the evening.",
    },
  },
  'fr.u2.check.s6': {
    because: "*Combien de* asks how many: *Il y a combien de personnes ?*",
    why: {
      'Il y a des personnes ?': "This asks are there people?, a yes or no question, not how many.",
      'Combien ça coûte ?': "This asks how much it costs.",
      'Quelle heure est-il ?': "This asks what time it is.",
    },
  },
  'fr.u2.check.s7': {
    because: "*Soixante-huit* is 68: sixty, then eight.",
    why: {
      '78': "78 would be *soixante-dix-huit*, sixty-ten-eight, with *dix* in the middle.",
      '88': "88 would be *quatre-vingt-huit*, four twenties and eight.",
      '48': "48 would be *quarante-huit*, starting with a 'k' sound.",
    },
  },
}
