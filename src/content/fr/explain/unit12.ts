import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 12's exercises.
export const explain12: Record<string, Explanation> = {
  /* Lesson 1: Ça te dit ? */
  'fr.u12.l1.s3': {
    because: '*Ça te dit de venir… ?* is an invitation: do you fancy coming…?',
    why: {
      'Did you go to the cinema?': 'That would be in the past: *tu es allé(e) au cinéma ?*',
      'Can you tell me where the cinema is?': "*Dit* here isn't about telling. *Ça te dit* means do you fancy it.",
      'Are you coming back from the cinema?': 'That would be *tu reviens du cinéma ?* You heard *de venir*, to come.',
    },
  },
  'fr.u12.l1.s5': {
    because: '*Tu veux* + a verb asks what someone wants: *tu veux venir ?*, do you want to come?',
    why: {
      'Tu peux venir à ma fête ?': '*Tu peux* means you can. This asks whether they are able to come, not whether they want to.',
      'Tu es venue à ma fête ?': 'This is in the past: did you come to my party?',
      'Tu vas venir à ma fête ?': 'This asks whether they are going to come, not whether they want to.',
    },
  },
  'fr.u12.l1.s7': {
    because: 'The fixed phrase is *ça te dit*, with *dit* from *dire*. *Ça* takes the il form.',
    why: {
      dis: '*Dis* goes with *je* or *tu*. After *ça*, the verb ends in *t*: *ça te dit*.',
      fait: '*Ça te fait* is a different phrase. To invite, French says *ça te dit*.',
      veux: '*Veux* needs *tu* in front: *tu veux manger… ?* After *ça te*, use *dit*.',
    },
  },
  'fr.u12.l1.s8': {
    because: "*Je t'invite* means I'm inviting you. When the bill comes, it means I'm paying.",
    why: {
      'Can you pay?': 'That would be *tu peux payer ?* Here the speaker offers to pay.',
      'Shall we split it?': 'Splitting the bill is *on partage ?* Here one person pays for both.',
      "You're paying!": "It's the other way round: *je t'invite* means I am paying.",
    },
  },
  'fr.u12.l1.s10': {
    because: '*Carrément* is a very casual, enthusiastic yes: totally, absolutely.',
    why: {
      'no way!': 'No way is *pas question !* *Carrément* is a strong yes.',
      'maybe!': 'Maybe is *peut-être*. *Carrément* leaves no doubt.',
      'carefully!': "It looks like an -ly word, but it means totally. Carefully is *prudemment*.",
    },
  },
  'fr.u12.l1.s11': {
    because: '*Avec plaisir* means with pleasure: a warm yes to an invitation.',
    why: {
      plaire: '*Plaire* is a verb, to please. After *avec* you need the noun *plaisir*.',
      plein: '*Plein* means full. *Avec plein* is not a phrase.',
      merci: '*Avec merci* is not French. Say *oui, merci* or *avec plaisir*.',
    },
  },
  'fr.u12.l1.s14': {
    because: "*C'est gentil, mais je ne suis pas libre* is a polite no, and *une autre fois ?* suggests another time.",
    why: {
      "That's kind, and I'm free. See you then!": 'You heard *mais*, but, and *ne… pas*: she is not free.',
      "It's nice, but it isn't free. One more time?": '*Libre* here is about time, not money. Free of charge is *gratuit*.',
      "That's kind, but I'm not coming. Never again!": '*Une autre fois* means another time. It keeps the door open.',
    },
  },
  'fr.u12.l1.s15': {
    because: '*Libre* means free, with time to spare. It ends in *e* for everyone.',
    why: {
      gratuit: '*Gratuit* means free of charge, for things that cost nothing. People are *libres*.',
      gentil: '*Je ne suis pas gentille* means I am not kind, which is not the point here.',
      libres: '*Libres* is plural. With *je*, use *libre*.',
    },
  },

  /* Lesson 2: La fête des Lumières */
  'fr.u12.l2.s3': {
    because: '*Lumières* are lights, so *la Fête des Lumières* is the Festival of Lights.',
    why: {
      'the music festival': 'That is *la Fête de la musique*, on 21 June.',
      'the Bastille Day fireworks': 'Those are *le feu d’artifice du 14 juillet*.',
      'the Christmas market': 'That is *le marché de Noël*.',
    },
  },
  'fr.u12.l2.s4': {
    because: '*Des bougies* are candles, the ones people in Lyon put in their windows on 8 December.',
    why: {
      bouteilles: '*Des bouteilles* are bottles.',
      boules: '*Des boules* are balls, like baubles for a Christmas tree.',
      bonbons: '*Des bonbons* are sweets.',
    },
  },
  'fr.u12.l2.s6': {
    because: '*La galette des rois* is eaten in January, with a little charm, *la fève*, hidden inside.',
    why: {
      'la bûche de Noël': 'The Yule log cake is eaten at Christmas, not in January, and has no charm.',
      'le réveillon': '*Le réveillon* is the dinner on Christmas Eve or New Year’s Eve, not a cake.',
      'le 14 juillet': '*Le 14 juillet* is a date in summer: Bastille Day.',
    },
  },
  'fr.u12.l2.s7': {
    because: "*Le 14 juillet* is Bastille Day, and *un feu d'artifice* is a fireworks display.",
    why: {
      'On 14 June, there are fireworks.': 'June is *juin*. You heard *juillet*, July.',
      'On 4 July, there is a parade.': 'You heard *quatorze*, fourteen, and *feu d’artifice*, fireworks.',
      'On Bastille Day, there is a market.': 'A market is *un marché*. *Un feu d’artifice* is fireworks.',
    },
  },
  'fr.u12.l2.s8': {
    because: '*Le réveillon* is the long dinner on the evening of 24 December (or 31 December).',
    why: {
      'réveil': '*Un réveil* is an alarm clock. *Réveillon* comes from the same verb, *réveiller*: people stay up late.',
      '14 juillet': '*Le 14 juillet* is in summer, not on 24 December.',
      galette: '*La galette des rois* is the January cake, not the dinner on 24 December.',
    },
  },
  'fr.u12.l2.s11': {
    because: 'On 1 January, and all through the month, you wish people *bonne année*.',
    why: {
      'Joyeux Noël !': '*Joyeux Noël* is for Christmas, on or before 25 December.',
      'Bon anniversaire !': '*Bon anniversaire* is for a birthday.',
      'Bon voyage !': '*Bon voyage* is for someone setting off on a trip. On 1 January, wish a good year.',
    },
  },
  'fr.u12.l2.s12': {
    because: '*Vœux* are wishes. *Meilleurs* is plural, so *vœux* takes an x.',
    why: {
      'vœu': '*Vœu* is one wish. *Meilleurs* is plural, so the noun is plural too: *vœux*.',
      vieux: '*Vieux* means old. It sounds a little like *vœux*, but means something else.',
      veux: '*Veux* is from *vouloir*: *je veux*, I want.',
    },
  },
  'fr.u12.l2.s14': {
    because: '*Félicitations* is for good news: a new job, a wedding, a baby.',
    why: {
      'Santé !': '*Santé* is cheers, when you clink glasses.',
      'Joyeux Noël !': '*Joyeux Noël* is only for Christmas.',
      'Bon appétit !': '*Bon appétit* is said before a meal.',
    },
  },
  'fr.u12.l2.s15': {
    because: '*Santé* is cheers, and *à la nouvelle année* means to the new year.',
    why: {
      'Cheers! Happy birthday!': 'Happy birthday is *bon anniversaire*. You heard *nouvelle année*.',
      'Bless you! Happy new year!': 'Bless you, after a sneeze, is *à tes souhaits*. *Santé* is a toast.',
      'Cheers! See you next year!': "See you next year is *à l'année prochaine*. *À la nouvelle année* is a toast to it.",
    },
  },

  /* Lesson 3: On verra ! */
  'fr.u12.l3.s3': {
    because: '*Je partirai* is the future of *partir*: the infinitive plus *-ai*.',
    why: {
      'I left on 20 December.': 'I left is *je suis parti(e)*, with *être*.',
      'I leave every 20 December.': 'The present is *je pars*. You heard the longer *partirai*.',
      'I was leaving on 20 December.': 'That would be *je partais*. The future ends in an "ay" sound: *partirai*.',
    },
  },
  'fr.u12.l3.s5': {
    because: 'With *on*, the future ends in *-a*: *on mangera*, we will eat.',
    why: {
      'a mangé': "*On a mangé* is the past: we ate. The sentence means we'll eat.",
      mangerai: '*Mangerai* goes with *je*. With *on*, use *mangera*.',
      manger: '*Manger* is the infinitive. *On* needs a conjugated verb: *on mangera*.',
    },
  },
  'fr.u12.l3.s8': {
    because: "*J'irai* is the future of *aller*, from the stem *ir-*.",
    why: {
      'I went': 'I went is *je suis allé(e)*.',
      'I go': 'I go is *je vais*.',
      "I'm going to read": 'I am going to read is *je vais lire*. *J’irai* is about going.',
    },
  },
  'fr.u12.l3.s9': {
    because: '*Ce sera* is the future of *c’est*: it will be.',
    why: {
      "c'était": "*C'était* means it was. *Demain* needs the future.",
      'ce serai': '*Serai* goes with *je*. With *ce*, use *sera*.',
      'ce seras': '*Seras* goes with *tu*. With *ce*, use *sera*.',
    },
  },
  'fr.u12.l3.s13': {
    because: '*On verra* is the future of *voir*: we will see.',
    why: {
      "I don't know yet… we saw it!": 'We saw it would be *on l’a vu*. *Verra* is the future.',
      "I didn't know… we'll go!": "You heard *je ne sais pas encore*, I don't know yet. And we'll go is *on ira*.",
      "I know now… let's look!": "*Je ne sais pas* means I don't know. *On verra* means we'll see.",
    },
  },
  'fr.u12.l3.s14': {
    because: '*Tu viendras* is the future of *venir*, from the stem *viendr-*.',
    why: {
      'Tu es venu à ma fête ?': 'This is the past: did you come to my party?',
      'Tu viens de ma fête ?': 'This means are you coming from my party?',
      'Tu verras ma fête ?': '*Verras* is from *voir*: will you see my party?',
    },
  },
  'fr.u12.l3.s15': {
    because: 'With *on*, the future of *pouvoir* is *on pourra*.',
    why: {
      pourrai: '*Pourrai* goes with *je*.',
      pourras: '*Pourras* goes with *tu*.',
      pouvoir: '*Pouvoir* is the infinitive. *On* needs a conjugated verb.',
    },
  },
  'fr.u12.l3.s17': {
    because: 'After a *si* clause in the present, the result goes in the future: *on mangera*.',
    why: {
      mangeons: '*Mangeons* goes with *nous*. With *on*, use *mangera*.',
      'a mangé': '*On a mangé* is the past. This is a plan for later.',
      mangerai: '*Mangerai* goes with *je*. With *on*, use *mangera*.',
    },
  },
  'fr.u12.l3.s18': {
    because: "*Si* takes the present, the result takes the future, and *si* + *il* becomes *s'il*.",
    why: {
      "S'il pleuvra, on restera à la maison.": 'Never put the future straight after *si*. Say *s’il pleut*.',
      "S'il pleut, on est restés à la maison.": '*On est restés* is the past: we stayed. The plan needs *on restera*.',
      'Si il pleut, on restera à la maison.': '*Si* drops its *i* before *il*: *s’il pleut*.',
    },
  },

  /* Lesson 4: Merci pour tout */
  'fr.u12.l4.s3': {
    because: '*Un cadeau* is a present, a gift.',
    why: {
      'a cake': 'A cake is *un gâteau*, which rhymes with *cadeau*.',
      'a card': 'A card is *une carte*.',
      'a candle': 'A candle is *une bougie*.',
    },
  },
  'fr.u12.l4.s4': {
    because: 'For presents, French uses *offrir*. After *je vais*, use the infinitive.',
    why: {
      ouvrir: '*Ouvrir* means to open. It looks like *offrir*, but to give a present, use *offrir*.',
      offert: '*Offert* is the past participle. After *je vais*, you need the infinitive *offrir*.',
      offre: '*Offre* is the present: *j’offre*. After *je vais*, use *offrir*.',
    },
  },
  'fr.u12.l4.s6': {
    because: "*Il ne fallait pas !* is what you say when given a present: you shouldn't have!",
    why: {
      "Oh, you didn't need to come! Thanks!": "There's no *venir* here. It's a fixed phrase about the gift.",
      "Oh, I didn't want it! Thanks!": "That would be rude! *Il ne fallait pas* is warm: you shouldn't have.",
      "Oh, don't do that! Thank you!": "It's about something already done: you shouldn't have.",
    },
  },
  'fr.u12.l4.s7': {
    because: 'The phrase is *ça me fait plaisir*. *Très* goes before *plaisir*.',
    why: {
      plaisirs: 'The phrase uses the singular: *ça me fait plaisir*.',
      content: '*Content* works with *je suis*: *je suis content(e)*. After *ça me fait*, use *plaisir*.',
      heureux: '*Heureux* works with *je suis*. After *ça me fait*, use *plaisir*.',
    },
  },
  'fr.u12.l4.s10': {
    because: "*Y* replaces a place after *à*: *tu vas à la fête ? Oui, j'y vais.*",
    why: {
      en: '*En* replaces *de* + a thing, not a place you go to.',
      le: '*Le* replaces a person or thing, not a place after *à*.',
      me: '*Me* means me. *J’me vais* is not French.',
    },
  },
  'fr.u12.l4.s11': {
    because: "*En* replaces *des bougies*, and the number stays: *j'en ai trois*.",
    why: {
      y: '*Y* replaces a place, not *des* + a thing.',
      les: 'With a number, French uses *en*: *j’en ai trois*, not *je les ai trois*.',
      me: '*Me* means me. It cannot stand for the candles.',
    },
  },
  'fr.u12.l4.s14': {
    because: "*À l'année prochaine* is a goodbye at the end of December: see you next year.",
    why: {
      'happy new year!': 'Happy new year is *bonne année !*',
      'last year!': "Last year is *l'année dernière*.",
      'see you next time!': "See you next time is *à la prochaine !* This one adds *année*, year.",
    },
  },

  /* Checkpoint */
  'fr.u12.check.s1': {
    because: "*Je ne suis pas libre* means she isn't free, so she can't come on Saturday.",
    why: {
      'She can come on Saturday.': 'You heard *mais* and *ne… pas libre*: that is a no.',
      "She's busy on Sunday.": 'You heard *samedi*, Saturday. Sunday is *dimanche*.',
      "She's inviting you on Saturday.": "*C'est gentil, mais…* is a reply to an invitation, not an invitation.",
    },
  },
  'fr.u12.check.s3': {
    because: 'After *si*, use the present: *s’il pleut*, if it rains.',
    why: {
      pleuvra: 'Never put the future straight after *si*. The future goes in the other half: *on restera*.',
      pleuvoir: '*Pleuvoir* is the infinitive. After *il*, you need the present: *s’il pleut*.',
      plu: '*Plu* is a past participle and cannot stand alone. A plan for later needs *s’il pleut*.',
    },
  },
  'fr.u12.check.s4': {
    because: 'In January, cards and e-mails say *meilleurs vœux*, best wishes for the new year.',
    why: {
      'Joyeux anniversaire !': 'This is for a birthday, not the new year.',
      'Félicitations !': '*Félicitations* is for good news, such as a new job.',
      'Bon appétit !': '*Bon appétit* is said before a meal.',
    },
  },
  'fr.u12.check.s6': {
    because: '*Ce sera* is the future of *c’est*: the party will be at Hugo’s.',
    why: {
      "C'était": "*C'était* means it was. The party hasn't happened yet.",
      'Ce serai': '*Serai* goes with *je*. With *ce*, use *sera*.',
      'Ce seront': '*Seront* is plural. *Ce* + one party takes *sera*.',
    },
  },
  'fr.u12.check.s8': {
    because: '*En janvier* is in January, and *la galette des rois* is king cake.',
    why: {
      'In June, people eat king cake.': 'June is *juin*. You heard *janvier*.',
      'In January, people eat Christmas cake.': '*La galette des rois* is king cake, eaten after Christmas.',
      'In January, people visit the king.': '*Les rois* are the kings in the name of the cake, here the Three Kings.',
    },
  },
  'fr.u12.check.s9': {
    because: "*Il ne fallait pas !* is the gracious thing to say when you're given a present.",
    why: {
      'Félicitations !': '*Félicitations* congratulates someone on their news. It is not a thank-you.',
      "Je t'invite !": "*Je t'invite* is an invitation, or offering to pay.",
      'Une autre fois !': '*Une autre fois* means another time, when saying no to an invitation.',
    },
  },
  'fr.u12.check.s11': {
    because: "*En* replaces *du gâteau*: *il y en a encore*, there's still some.",
    why: {
      y: '*Il y* is already there. The missing word stands for the cake: *en*.',
      le: '*Le* would mean it, the whole cake. *Du gâteau* is replaced by *en*.',
      de: '*Il y de a* is not French. *De* + the cake becomes *en*.',
    },
  },
}
