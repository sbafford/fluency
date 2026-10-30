import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 6's exercises.
export const explain6: Record<string, Explanation> = {
  'fr.u6.l1.s3': {
    because: "*Je me couche* means I go to bed. It comes from *se coucher*, to lie down.",
    why: {
      'I get up.': "I get up is *je me lève*, which ends in a \"v\" sound.",
      'I get dressed.': "I get dressed is *je m'habille*, where *me* shortens to *m'* and you hear \"mah-bee\".",
      'I have a shower.': "I have a shower is *je me douche*. It ends in \"sh\" like *couche*, but starts with a \"d\".",
    },
  },
  'fr.u6.l1.s6': {
    because: "With *tu*, the little reflexive word is *te*: *tu te lèves*, you get up.",
    why: {
      me: "*Me* goes with *je*: *je me lève*.",
      se: "*Se* goes with *il*, *elle* and *on*: *il se lève*.",
      tu: "*Tu* is already the subject. The verb needs *te* after it: *tu te lèves*.",
    },
  },
  'fr.u6.l1.s7': {
    because: "*Je m'habille* is I get dressed. *Me* becomes *m'* before the silent h of *habille*.",
    why: {
      'Je me douche.': "*Je me douche* means I have a shower.",
      'Je me lève.': "*Je me lève* means I get up.",
      'Je me couche.': "*Je me couche* means I go to bed.",
    },
  },
  'fr.u6.l1.s9': {
    because: "*Je déjeune* means I have lunch, and *à midi* means at midday.",
    why: {
      'I have breakfast at midday.': "Breakfast is *le petit-déjeuner*: *je prends le petit-déjeuner*. *Je déjeune* is lunch.",
      'I go home at midday.': "I go home is *je rentre*. You heard *je déjeune*.",
      'I have lunch at midnight.': "Midnight is *minuit*, which ends in \"wee\". *Midi* ends in \"dee\".",
    },
  },
  'fr.u6.l1.s14': {
    because: "*D'habitude* means usually, which fits a routine described in the present.",
    why: {
      Demain: "*Demain* means tomorrow, but the sentence talks about what you usually do.",
      Hier: "*Hier* means yesterday, which would need a past tense, not *je me lève*.",
      'Ce soir': "*Ce soir* means this evening. You don't get up in the evening, and it isn't a habit.",
    },
  },
  'fr.u6.l1.s17': {
    because: "*D'abord* means first and *ensuite* means then, with the shower before getting dressed.",
    why: {
      'Ensuite, je me douche. D\'abord, je m\'habille.': "The order words are swapped: this says then I shower, first I get dressed.",
      "D'abord, je me couche. Ensuite, je me lève.": "This says first I go to bed, then I get up. *Se coucher* and *se lever* are different actions.",
      "Enfin, je me douche. D'habitude, je m'habille.": "*Enfin* means finally and *d'habitude* means usually, not first and then.",
    },
  },
  'fr.u6.l2.s3': {
    because: "*Il fait froid* means it's cold. Most weather phrases start with *il fait*.",
    why: {
      "It's hot.": "It's hot is *il fait chaud*, which ends in a \"sho\" sound.",
      "It's nice weather.": "Nice weather is *il fait beau*, ending in \"bo\".",
      "It's raining.": "It's raining is *il pleut*, with no *fait* at all.",
    },
  },
  'fr.u6.l2.s5': {
    because: "*Quel temps fait-il ?* asks about the weather. Here *temps* means weather.",
    why: {
      'Quelle heure est-il ?': "*Quelle heure est-il ?* asks the time on the clock.",
      'Ça va ?': "*Ça va ?* asks how someone is.",
      'On est quel jour ?': "*On est quel jour ?* asks what day it is.",
    },
  },
  'fr.u6.l2.s8': {
    because: "*Il neige* means it's snowing. *La neige* is snow.",
    why: {
      "It's raining.": "It's raining is *il pleut*, which ends in an \"uh\" sound, not \"ezh\".",
      "It's windy.": "It's windy is *il y a du vent*.",
      "It's cold.": "It's cold is *il fait froid*.",
    },
  },
  'fr.u6.l2.s9': {
    because: "Sun is a thing that is there, so it uses *il y a*: *il y a du soleil*, it's sunny.",
    why: {
      beau: "*Beau* goes with *il fait*: *il fait beau*. *Il y a du beau* isn't French.",
      chaud: "*Chaud* also goes with *il fait*: *il fait chaud*, it's hot.",
      pleut: "*Pleut* is a verb: *il pleut*, it's raining. It can't follow *du*.",
    },
  },
  'fr.u6.l2.s12': {
    because: "Weather phrases like this use *il fait*: *il fait beau*, the weather is nice.",
    why: {
      est: "*Il est beau* means he or it is handsome or beautiful, about a person or thing, not the weather.",
      a: "*Il a* means he has. Weather uses *il fait*.",
      'y a': "*Il y a* goes with things like *du soleil* or *du vent*, not with *beau*.",
    },
  },
  'fr.u6.l2.s16': {
    because: "Spring is the odd one out: *au printemps*. The other seasons take *en*.",
    why: {
      En: "*En* works for *en été*, *en automne* and *en hiver*, but spring is always *au printemps*.",
      À: "*À* + *le printemps* merges into *au*, so *à printemps* isn't used.",
      Dans: "*Dans* means inside something. Seasons use *au* or *en*, and spring is the one that takes *au*.",
    },
  },
  'fr.u6.l2.s17': {
    because: "*Vingt-cinq* is 25, so *il fait vingt-cinq degrés* is 25 °C.",
    why: {
      '35 °C': "35 is *trente-cinq*, starting with \"tront\". You heard *vingt* (\"van\").",
      '15 °C': "15 is *quinze*, one word starting with a \"k\" sound.",
      '20 °C': "20 is just *vingt*. The *cinq* after it makes 25.",
    },
  },
  'fr.u6.l3.s3': {
    because: "*À plus !* is short for *à plus tard*, see you later. In texts it's often *A+*.",
    why: {
      'Coucou !': "*Coucou !* is a casual hi, used to start a message, not end one.",
      'Bisous !': "*Bisous !* means kisses or love, a warm way to sign off to friends.",
      'Merci !': "*Merci !* means thank you.",
    },
  },
  'fr.u6.l3.s4': {
    because: "*Merci pour* means thanks for: *merci pour le café*.",
    why: {
      Désolé: "*Désolé* means sorry. *Désolé pour le café* would be an apology, not thanks.",
      Coucou: "*Coucou* means hi. It doesn't thank anyone.",
      Bisous: "*Bisous* means kisses, used to end a message, not to say thanks.",
    },
  },
  'fr.u6.l3.s8': {
    because: "*Je suis désolée* is I'm sorry, and *je ne peux pas venir* is I can't come.",
    why: {
      "Thanks, I'm coming.": "That would be *Merci, je viens*. You heard *désolée* and a *ne… pas*.",
      "I'm sorry, I'm late.": "I'm late is *je suis en retard*. You heard *je ne peux pas venir*.",
      "See you soon, I'm coming.": "See you soon is *à bientôt*. The sentence starts with an apology instead.",
    },
  },
  'fr.u6.l3.s13': {
    because: "Léa is a woman, so dear is *chère*: *Chère Léa*. It sounds the same as *cher*.",
    why: {
      Cher: "*Cher* is for a man: *Cher Hugo*. For Léa, add the e: *chère*.",
      Chers: "*Chers* is for several people, like *chers amis*. One woman, Léa, takes *chère*.",
      Madame: "*Madame* is a formal title, used alone or with a surname, never before a first name like Léa.",
    },
  },
  'fr.u6.l3.s14': {
    because: "*Cordialement* is the standard sign-off for work and formal e-mails.",
    why: {
      Bisous: "*Bisous* means kisses, only for friends and family.",
      'Grosses bises': "*Grosses bises* means big kisses, very warm and only for people close to you.",
      'À plus !': "*À plus !* means see you later, a casual text sign-off.",
    },
  },
  'fr.u6.l3.s15': {
    because: "*Bien à vous* is a polite sign-off for people you say *vous* to, like best regards.",
    why: {
      Bisous: "*Bisous* means kisses, far too familiar after *votre aide*.",
      Coucou: "*Coucou* means hi. It opens a casual message rather than closing one.",
      'À plus': "*À plus* means see you later, a casual sign-off for friends.",
    },
  },
  'fr.u6.l4.s3': {
    because: "On a form, *prénom* is your first name.",
    why: {
      surname: "Surname is *nom*. Watch out: *nom* on a form means your family name.",
      address: "Address is *l'adresse*.",
      postcode: "Postcode is *le code postal*.",
    },
  },
  'fr.u6.l4.s4': {
    because: "On a form, *nom* means surname, so WILSON is the family name.",
    why: {
      'first name': "First name is *prénom*.",
      nationality: "Nationality is *la nationalité*.",
      occupation: "Occupation is *la profession*.",
    },
  },
  'fr.u6.l4.s8': {
    because: "*La date de naissance* is the date of birth. *Naissance* means birth.",
    why: {
      nationality: "Nationality is *la nationalité*, which sounds close to the English word.",
      'phone number': "Phone number is *le numéro de téléphone*.",
      'first name': "First name is *le prénom*.",
    },
  },
  'fr.u6.l4.s9': {
    because: "For nationality you write the adjective: *australienne*, the feminine form for a woman.",
    why: {
      Perth: "Perth is a city, which would go next to *ville*, not *nationalité*.",
      communication: "*Communication* is a field of work, which fits *profession*.",
      Wilson: "Wilson is a surname, which goes next to *nom*.",
    },
  },
  'fr.u6.l4.s11': {
    because: "*Votre profession ?* asks what you do for work, so the reply is *Je travaille dans la communication*.",
    why: {
      'Je suis australienne.': "This answers *Votre nationalité ?*, not a question about your job.",
      "J'habite à Londres.": "This answers *Vous habitez où ?*, about where you live.",
      "Je m'appelle Sarah.": "This answers *Comment vous appelez-vous ?*, about your name.",
    },
  },
  'fr.u6.l4.s15': {
    because: "The letters spell M-A-R-T-I-N: Martin. French *I* sounds like \"ee\".",
    why: {
      Marten: "Marten would need the letter *E*, which sounds like \"uh\". You heard *I* (\"ee\").",
      Mertin: "Mertin would need *E* second. You heard *A*, which sounds like \"ah\".",
      Martine: "Martine has an extra *E* on the end. The spelling stopped at *N*.",
    },
  },
  'fr.u6.l4.s16': {
    because: "*Arobase* is the @ sign and *point* is the dot: lea@mail.fr.",
    why: {
      'lea.mail@fr': "That would be *léa point mail arobase F R*, with *point* before *mail*.",
      'lea@mail.com': "That would end *point com*. You heard *point F R*.",
      'lea@fr.mail': "That would be *léa arobase F R point mail*, in the opposite order.",
    },
  },
  'fr.u6.l4.s20': {
    because: "Postcode is *le code postal*. *Postal* is the adjective that goes with *code*.",
    why: {
      poste: "*La poste* is the post office. The form says *code postal*.",
      ville: "*Ville* means town or city, a separate line on the form.",
      numéro: "*Numéro* means number, as in *numéro de téléphone*. A postcode is a *code postal*.",
    },
  },
  'fr.u6.check.s1': {
    because: "*Demain* is tomorrow, *il pleut* is it's raining and *il fait froid* is it's cold.",
    why: {
      "Tomorrow it's sunny and hot.": "That would be *il y a du soleil et il fait chaud*.",
      "Today it's raining and cold.": "Today is *aujourd'hui*. You heard *demain*, tomorrow.",
      "Tomorrow it's windy and cold.": "Windy is *il y a du vent*. You heard *il pleut*, it's raining.",
    },
  },
  'fr.u6.check.s3': {
    because: "Winter takes *en*: *en hiver*, just like *en été* and *en automne*.",
    why: {
      Au: "*Au* is only for spring: *au printemps*. Winter is *en hiver*.",
      À: "*À hiver* isn't used. Seasons take *en*, except *au printemps*.",
      Le: "*Le* would shorten to *l'hiver*, which is just winter, not in winter.",
    },
  },
  'fr.u6.check.s4': {
    because: "*Cordialement* is the safe, standard way to sign off a work e-mail.",
    why: {
      Bisous: "*Bisous* means kisses, for friends and family only.",
      'Grosses bises': "*Grosses bises* means big kisses, too warm for work.",
      Coucou: "*Coucou* means hi, a casual greeting rather than a sign-off.",
    },
  },
  'fr.u6.check.s6': {
    because: "*Date de naissance* is date of birth. You'll see it on almost every French form.",
    why: {
      postcode: "Postcode is *code postal*.",
      nationality: "Nationality is *nationalité*.",
      signature: "Signature is *signature*, spelt the same as in English.",
    },
  },
  'fr.u6.check.s8': {
    because: "*Hugo arobase mail point F R* is hugo@mail.fr: *arobase* is @, *point* is the dot.",
    why: {
      'hugo.mail@fr': "That would be *hugo point mail arobase F R*, with *point* first.",
      'hugo@mail.com': "That would end *point com*. You heard *point F R*.",
      'hugo@fr.mail': "That would be *hugo arobase F R point mail*.",
    },
  },
  'fr.u6.check.s10': {
    because: "Forty degrees is hot, and hot weather is *il fait chaud*.",
    why: {
      froid: "*Il fait froid* means it's cold, which doesn't fit forty degrees.",
      mauvais: "*Il fait mauvais* means the weather is bad, not hot.",
      neige: "*Neige* is snow, as in *il neige*. *Il fait neige* isn't French.",
    },
  },
}
