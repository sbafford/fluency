import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 9's exercises.
export const explain9: Record<string, Explanation> = {
  /* Lesson 1: J'ai mal… */
  'fr.u9.l1.s3': {
    because: "*Le dos* is the back, and *au dos* is *à* + *le*: *j'ai mal au dos*, my back hurts.",
    why: {
      "I've got a headache.": "A headache is *j'ai mal à la tête*. Listen for *dos* at the end, not *tête*.",
      "I've got stomach ache.": "Stomach ache is *j'ai mal au ventre*. You heard *dos*, the back.",
      "I've got toothache.": "Toothache is *j'ai mal aux dents*, with a plural *aux*. You heard *au dos*.",
    },
  },
  'fr.u9.l1.s6': {
    because: "*Les dents* is plural, and *à* + *les* always joins to make *aux*.",
    why: {
      au: '*Au* is *à* + *le*, for one masculine thing: *au dos*. *Dents* is plural.',
      'à la': '*À la* goes with one feminine thing: *à la tête*. *Dents* is plural.',
      'à les': 'French never says *à les*. It always joins to make *aux*.',
    },
  },
  'fr.u9.l1.s7': {
    because: "*Le dos* is masculine, and *à* + *le* joins to make *au*.",
    why: {
      'à le': 'French never says *à le*. It always joins to make *au*.',
      'à la': "*À la* is for feminine words like *la tête*. *Dos* is masculine: *le dos*.",
      aux: "*Aux* is for plurals like *les dents*. There's only one back.",
    },
  },
  'fr.u9.l1.s8': {
    because: "*La gorge* is the throat: *j'ai mal à la gorge*, I've got a sore throat.",
    why: {
      "J'ai mal au ventre.": "*Le ventre* is the stomach, so this means I've got stomach ache.",
      "J'ai mal à la tête.": "*La tête* is the head, so this means I've got a headache.",
      "J'ai mal aux dents.": "*Les dents* are teeth, so this means I've got toothache.",
    },
  },
  'fr.u9.l1.s11': {
    because: '*La cheville* is the ankle. It sounds like "shuh-vee".',
    why: {
      'the foot': 'The foot is *le pied*.',
      'the leg': 'The leg is *la jambe*.',
      'the back': 'The back is *le dos*.',
    },
  },
  'fr.u9.l1.s16': {
    because: "*Je tousse* is I'm coughing, and *j'ai de la fièvre* is I've got a temperature.",
    why: {
      "I'm coughing and I've got a cold.": "A cold is *un rhume*. You heard *de la fièvre*, a temperature.",
      "I'm tired and I've got a temperature.": "Tired is *fatigué(e)*. *Je tousse* means I'm coughing.",
      "I'm sneezing and I've got a temperature.": "Sneezing is *éternuer*. *Je tousse* means I'm coughing.",
    },
  },
  'fr.u9.l1.s17': {
    because: "How you feel takes *être*: *je suis fatiguée*, I'm tired.",
    why: {
      ai: "*Avoir* goes with symptoms you have, like *j'ai un rhume*. Tired is *je suis fatigué(e)*.",
      fais: '*Je fais* means I do or I make. Feelings take *je suis*.',
      vais: '*Je vais* means I go. *Ça va* asks how you are, but tired is *je suis fatigué(e)*.',
    },
  },
  'fr.u9.l1.s18': {
    because: "You \"have\" a cold in French: *tu as un rhume*, from *avoir*.",
    why: {
      es: '*Tu es* means you are. A cold is something you have: *tu as un rhume*.',
      fais: '*Tu fais* means you do or you make. Use *avoir* for a cold.',
      vas: '*Tu vas* means you go. Use *avoir* for a cold.',
    },
  },
  'fr.u9.l1.s19': {
    because: "*Malade* means ill or sick: *je suis malade*, I'm ill.",
    why: {
      "I'm tired.": "I'm tired is *je suis fatigué(e)*.",
      "I'm cold.": "I'm cold is *j'ai froid*, with *avoir*.",
      "I'm sad.": "I'm sad is *je suis triste*. *Malade* is about health.",
    },
  },

  /* Lesson 2: Prendre rendez-vous */
  'fr.u9.l2.s3': {
    because: "*Prendre rendez-vous* is to make an appointment. *Je voudrais* is I'd like.",
    why: {
      "I'd like to cancel an appointment.": 'To cancel is *annuler*: *je voudrais annuler mon rendez-vous*.',
      "I'd like to see the doctor now.": 'You heard *prendre rendez-vous*, to make an appointment, not to see someone now.',
      "I'd like to call the doctor.": 'To call is *appeler*. *Prendre rendez-vous* means to make an appointment.',
    },
  },
  'fr.u9.l2.s5': {
    because: "*Le cabinet* is a doctor's surgery, and surgeries answer the phone this way.",
    why: {
      "Dr Lambert's pharmacy, hello.": 'A pharmacy is *une pharmacie*. *Un cabinet* is where a doctor sees patients.',
      "Dr Lambert's office at the hospital.": 'A hospital is *un hôpital*. *Le cabinet* is a local surgery.',
      'Dr Lambert speaking, hello.': "The doctor speaking would be *c'est le docteur Lambert*. *Cabinet* is the surgery.",
    },
  },
  'fr.u9.l2.s6': {
    because: "*Chez le médecin* means to the doctor's. *Chez* goes before a person.",
    why: {
      cabinet: "*Chez* goes with a person. For the place, say *je vais au cabinet*.",
      pharmacie: "*Pharmacie* is feminine and a place: *je vais à la pharmacie*.",
      urgent: "*Urgent* is an adjective: *c'est urgent*. You need a person after *chez le*.",
    },
  },
  'fr.u9.l2.s10': {
    because: "*Ça me va* means that suits me. *Me* is me.",
    why: {
      vous: "*Ça vous va ?* asks if it suits you. To answer for yourself, say *ça me va*.",
      te: '*Ça te va* means it suits you, with *tu*. Answer for yourself with *me*.',
      se: '*Se* is for him, her or them in reflexive verbs. It does not fit here.',
    },
  },
  'fr.u9.l2.s11': {
    because: '*Plus tard* means later.',
    why: {
      "Plus tôt, c'est possible ?": '*Plus tôt* means earlier, the opposite of later.',
      "Demain, c'est possible ?": '*Demain* means tomorrow, not later.',
      "Ce soir, c'est possible ?": '*Ce soir* means this evening, not later.',
    },
  },
  'fr.u9.l2.s16': {
    because: "*Depuis deux jours* with the present means it started two days ago and still hurts: I've had it for two days.",
    why: {
      'I had a sore throat two days ago.': '*Depuis* means it still hurts now. Two days ago would be *il y a deux jours*.',
      "I've had a sore throat for two weeks.": 'Two weeks is *deux semaines*. You heard *deux jours*, two days.',
      "I'll have a sore throat in two days.": 'In two days is *dans deux jours*. *Depuis* looks back, not forward.',
    },
  },
  'fr.u9.l2.s17': {
    because: "*Depuis quand ?* asks how long something has been going on. It goes with the present tense.",
    why: {
      pour: '*Pour quand ?* asks for when, about the future. Ongoing pain takes *depuis*.',
      pendant: '*Pendant* means during. *Pendant quand* is not French.',
      'il y a': '*Il y a* means ago. *Il y a quand* is not French.',
    },
  },
  'fr.u9.l2.s18': {
    because: '*Où* means where, and *avoir mal* means to hurt: where does it hurt?',
    why: {
      'How long has it hurt?': 'How long is *depuis quand ?*. *Où* means where.',
      'Does it hurt a lot?': 'Does it hurt a lot? is *vous avez très mal ?*. *Où* means where.',
      'Why does it hurt?': 'Why is *pourquoi*. *Où* means where.',
    },
  },
  'fr.u9.l2.s19': {
    because: "*La carte Vitale* is the French health insurance card.",
    why: {
      "Don't forget your bank card!": 'A bank card is *une carte bancaire*. *Vitale* is the health card.',
      "Don't forget your prescription!": 'A prescription is *une ordonnance*.',
      "Don't forget your ID card!": "An ID card is *une carte d'identité*.",
    },
  },

  /* Lesson 3: À la pharmacie */
  'fr.u9.l3.s3': {
    because: "*La toux* is a cough, from *tousser*. *Quelque chose pour* means something for.",
    why: {
      'Have you got something for a cold?': 'A cold is *un rhume*. You heard *la toux*, a cough.',
      'Have you got something for a headache?': 'A headache would be *pour le mal de tête*. You heard *la toux*.',
      'Have you got a prescription for a cough?': 'A prescription is *une ordonnance*. You heard *quelque chose*, something.',
    },
  },
  'fr.u9.l3.s5': {
    because: '*Une ordonnance* is a prescription from the doctor.',
    why: {
      'Have you got an appointment?': 'An appointment is *un rendez-vous*.',
      'Have you got your health card?': 'The health card is *la carte Vitale*.',
      'Have you got some tablets?': 'Tablets are *des comprimés*.',
    },
  },
  'fr.u9.l3.s6': {
    because: "*Comprimés* is plural, so \"some\" is *des*.",
    why: {
      du: '*Du* is for one masculine thing you cannot count, like *du sirop*.',
      'de la': '*De la* is for one feminine thing, like *de la fièvre*. *Comprimés* is plural.',
      un: '*Un* is one, singular: *un comprimé*. *Comprimés* has an s.',
    },
  },
  'fr.u9.l3.s8': {
    because: "*Trois fois par jour* is three times a day, and *après les repas* is after meals.",
    why: {
      'Three times a day, before meals.': 'Before is *avant*. You heard *après*, after.',
      'Three tablets a day, after meals.': 'Tablets are *comprimés*. *Fois* means times.',
      'For three days, after meals.': 'For three days is *pendant trois jours*. You heard *trois fois par jour*.',
    },
  },
  'fr.u9.l3.s14': {
    because: "The pharmacist calls her *madame*, so he uses *vous*: *vous prenez* becomes *prenez !*",
    why: {
      Prenons: "*Prenons* means let's take, including the speaker. He isn't taking it himself.",
      Prendre: '*Prendre* is the infinitive, as on a medicine box. Spoken to someone, use *prenez*.',
      Pris: '*Pris* is the past participle, taken. It cannot start an instruction.',
    },
  },
  'fr.u9.l3.s15': {
    because: "*Buvez* is the *vous* command from *boire*, and *beaucoup d'eau* is lots of water.",
    why: {
      'Buvez beaucoup de vin.': '*Du vin* is wine. Water is *eau*.',
      "Bouvez beaucoup d'eau.": 'The *vous* form of *boire* is *buvez*, with a u. *Bouvez* is not a word.',
      "Vous buvez beaucoup d'eau ?": 'With *vous* this is a question: do you drink lots of water? A command drops *vous*.',
    },
  },
  'fr.u9.l3.s19': {
    because: "*Ne vous inquiétez pas* is the *vous* command: don't worry.",
    why: {
      inquiète: "*Inquiète* goes with *tu*: *ne t'inquiète pas*. Here it's *vous*.",
      inquiéter: '*Inquiéter* is the infinitive. A command uses the *vous* form, *inquiétez*.',
      inquiétons: "*Inquiétons* is the *nous* form: let's not worry. *Vous* needs *inquiétez*.",
    },
  },

  /* Lesson 4: Des conseils */
  'fr.u9.l4.s3': {
    because: "*Tordu* means twisted, and *la cheville* is the ankle.",
    why: {
      "I've broken my ankle.": "Broken is *cassé*: *je me suis cassé la cheville*. You heard *tordu*.",
      "I've hurt my foot.": "The foot is *le pied*. You heard *la cheville*, the ankle.",
      "I've twisted my leg.": "The leg is *la jambe*. You heard *la cheville*, the ankle.",
    },
  },
  'fr.u9.l4.s6': {
    because: "*Tomber* takes *être*, so the participle agrees with Léa: one woman, *tombée*.",
    why: {
      tombé: '*Tombé* is for a man. With *être*, add e for a woman: *Léa est tombée*.',
      tombées: '*Tombées* is for several women. Léa is one person.',
      tomber: '*Tomber* is the infinitive. After *est*, use the past participle.',
    },
  },
  'fr.u9.l4.s7': {
    because: "*Se faire mal* means to hurt yourself: *je me suis fait mal*.",
    why: {
      "I've made a mistake.": "A mistake is *une erreur*: *j'ai fait une erreur*.",
      'I feel bad.': 'I feel bad is *je me sens mal*.',
      "I'm not well.": "I'm not well is *je ne vais pas bien* or *je suis malade*.",
    },
  },
  'fr.u9.l4.s9': {
    because: "*Il faut* + infinitive means you need to, in general. It never changes.",
    why: {
      dois: '*Dois* goes with *je* or *tu*. After *il*, devoir is *doit*, which means he has to.',
      faux: '*Faux* sounds the same but means false or wrong.',
      fait: "*Il fait* is for weather, like *il fait beau*. Must is *il faut*.",
    },
  },
  'fr.u9.l4.s14': {
    because: '*Devoir* with *vous* is *vous devez*: you have to.',
    why: {
      dois: '*Dois* goes with *je* or *tu*.',
      doit: '*Doit* goes with *il*, *elle* or *on*.',
      devons: '*Devons* goes with *nous*.',
    },
  },
  'fr.u9.l4.s15': {
    because: "*Tu devrais* is friendly advice: you should.",
    why: {
      dois: "*Tu dois* means you have to. It's stronger than \"you should\".",
      faut: '*Faut* only works after *il*: *il faut*. It never goes with *tu*.',
      devez: '*Devez* goes with *vous*. Hugo is a friend, so *tu*.',
    },
  },
  'fr.u9.l4.s17': {
    because: "With *tu*, it's *tu dois*, and the reflexive word matches: *te reposer*.",
    why: {
      'Tu dois vous reposer.': '*Vous* does not match *tu*. With *tu*, say *te reposer*.',
      'Tu doit te reposer.': '*Doit* is for *il* or *elle*. With *tu*, write *dois*.',
      'Vous devez te reposer.': '*Vous devez* is for someone you call *vous*, and then *vous reposer*. *Te* does not match.',
    },
  },
  'fr.u9.l4.s19': {
    because: '*Les urgences* is the emergency department, A&E.',
    why: {
      'You need to go to the duty chemist.': 'The duty chemist is *la pharmacie de garde*.',
      'You need to call an ambulance.': 'Calling would be *appeler*. You heard *aller aux urgences*, go to A&E.',
      "You need to go to the doctor's.": "The doctor's is *chez le médecin*. *Les urgences* is A&E.",
    },
  },
  'fr.u9.l4.s20': {
    because: '15 is the SAMU, the medical emergency number in France. 112 works too.',
    why: {
      'Appelez le 17 !': '17 is the police in France.',
      'Appelez le 999 !': '999 is the UK number. In France, call 15 or 112.',
      'Appelez le 000 !': '000 is the Australian number. In France, call 15 or 112.',
    },
  },

  /* Checkpoint */
  'fr.u9.check.s1': {
    because: "*Aux dents* is toothache, and *depuis hier* with the present means it started yesterday and still hurts.",
    why: {
      'I had toothache yesterday.': "*Depuis hier* means it started yesterday and still hurts today. It isn't only about yesterday.",
      "I've had a headache since yesterday.": 'A headache is *mal à la tête*. You heard *aux dents*, teeth.',
      "I've had toothache for two days.": 'Two days is *deux jours*. You heard *hier*, yesterday.',
    },
  },
  'fr.u9.check.s3': {
    because: "*La tête* is feminine, so it's *à la tête*.",
    why: {
      au: "*Au* is for masculine words like *le dos*. *Tête* is feminine.",
      aux: '*Aux* is for plurals like *les dents*.',
      'à le': 'French never says *à le*. It joins to make *au*, and *tête* is feminine anyway.',
    },
  },
  'fr.u9.check.s4': {
    because: '*Deux comprimés* is two tablets, and *trois fois par jour* is three times a day.',
    why: {
      'Prenez deux comprimés trois jours par semaine.': 'This says three days a week. A day is *jour*, and times is *fois*.',
      'Prenez deux comprimés pendant trois jours.': 'This says for three days. Three times a day is *trois fois par jour*.',
      'Prenez trois comprimés deux fois par jour.': 'This swaps the numbers: three tablets, twice a day.',
    },
  },
  'fr.u9.check.s6': {
    because: '*Ça me va* means that suits me. *Ça* takes the *il* form of *aller*: *va*.',
    why: {
      vais: '*Vais* goes with *je*. The subject here is *ça*.',
      vas: '*Vas* goes with *tu*. The subject here is *ça*.',
      allez: '*Allez* goes with *vous*. The subject here is *ça*.',
    },
  },
  'fr.u9.check.s7': {
    because: "*La pharmacie de garde* is the duty chemist, and *ouverte* means open.",
    why: {
      'Pharmacy closed this Sunday': 'Closed is *fermée*. *Ouverte* means open.',
      'Doctor available this Sunday': 'A doctor is *un médecin*. The sign is for a pharmacy.',
      'A&E open on Sundays': 'A&E is *les urgences*. *Ce dimanche* is this Sunday, not every Sunday.',
    },
  },
  'fr.u9.check.s10': {
    because: "*Il ne faut pas* forbids something: you mustn't drive.",
    why: {
      "You don't have to drive.": "Not having to is *vous n'êtes pas obligé(e) de*. *Il ne faut pas* means you mustn't.",
      'You need to drive.': 'You need to drive would be *il faut conduire*, without *ne… pas*.',
      "He doesn't want to drive.": "He doesn't want is *il ne veut pas*. *Il faut* is not about a person.",
    },
  },
}
