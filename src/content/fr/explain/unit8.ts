import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 8's exercises.
export const explain8: Record<string, Explanation> = {
  /* Lesson 1: Je suis allé(e)… */
  'fr.u8.l1.s3': {
    because: '*Je suis partie* is the past of *partir*, to leave. *Mardi* is Tuesday.',
    why: {
      'I arrived on Tuesday.': 'I arrived is *je suis arrivée*, from *arriver*.',
      "I'm leaving on Tuesday.": "I'm leaving is the present, *je pars*. *Je suis partie* is already done: I left.",
      'I came home on Tuesday.': 'I came home is *je suis rentrée*, from *rentrer*.',
    },
  },
  'fr.u8.l1.s6': {
    because: '*Arriver* is a coming-and-going verb, so its past uses *être*: *je suis arrivée*.',
    why: {
      ai: '*Ai* is from *avoir*. Most verbs use it, but *arriver* takes *être*.',
      est: '*Est* goes with *il*, *elle* and *on*. With *je*, *être* is *suis*.',
      sommes: '*Sommes* goes with *nous*: *nous sommes arrivées*.',
    },
  },
  'fr.u8.l1.s7': {
    because: '*Rentrer*, to come home, takes *être*: *je suis rentrée hier*.',
    why: {
      "J'ai rentré hier.": '*Rentrer* in the sense of coming home takes *être*, not *avoir*.',
      'Je rentre hier.': '*Je rentre* is the present. With *hier* you need the past: *je suis rentrée*.',
      'Je suis restée hier.': '*Je suis restée* means I stayed, from *rester*.',
    },
  },
  'fr.u8.l1.s9': {
    because: '*Je suis resté* is the past of *rester*, to stay. *Trois jours* is three days.',
    why: {
      'I left three days ago.': 'I left is *je suis parti*, and three days ago is *il y a trois jours*.',
      'I arrived three days ago.': 'I arrived is *je suis arrivé*, and three days ago is *il y a trois jours*.',
      'I rested for three days.': '*Rester* looks like "rest" but means to stay. To rest is *se reposer*.',
    },
  },
  'fr.u8.l1.s12': {
    because: 'With *être*, the past form agrees. Sarah is a woman, so *sortie* takes an extra e.',
    why: {
      sorti: '*Sorti* is for a man: *Hugo est sorti*. Sarah needs *sortie*.',
      sortir: '*Sortir* is the infinitive, to go out. After *est* you need the past form.',
      sort: '*Sort* is the present, she goes out. *Hier soir* needs the past.',
    },
  },
  'fr.u8.l1.s13': {
    because: '*Elle est tombée* is the past of *tomber*, to fall, for a woman.',
    why: {
      'She fell asleep.': 'She fell asleep is *elle s\'est endormie*. *Tomber* is a real fall.',
      'He fell.': '*Elle* is she. He fell is *il est tombé*, without the extra e.',
      'She is falling.': '*Est tombée* is the past. She is falling would be *elle tombe*.',
    },
  },
  'fr.u8.l1.s16': {
    because: 'Léa and Hugo are a mixed group, and a mixed group takes the masculine plural: *allés*.',
    why: {
      allées: '*Allées* is only for a group of women. One man in the group makes it *allés*.',
      allé: '*Allé* is for one man. Two people need the plural s.',
      aller: '*Aller* is the infinitive. After *sont* you need the past form.',
    },
  },

  /* Lesson 2: À la gare */
  'fr.u8.l2.s3': {
    because: '*Annulé* means cancelled. *De neuf heures* tells you which train: the nine o\'clock one.',
    why: {
      "The nine o'clock train is late.": 'Late is *en retard*. *Annulé* means it is not running at all.',
      'The train leaves at nine.': 'Leaves at nine is *part à neuf heures*. Nothing in the sentence is about leaving.',
      "The nine o'clock train has left.": 'Has left is *est parti*. *Annulé* is cancelled.',
    },
  },
  'fr.u8.l2.s4': {
    because: 'After a length of time, French says *de retard*: *vingt minutes de retard*.',
    why: {
      'en retard': '*En retard* stands alone: *le train est en retard*. After *minutes de*, just *retard*.',
      retards: '*Retard* stays singular here, however long the delay.',
      tard: '*Tard* means late, as in *il est tard*, it is late. After *minutes de* you need the noun *retard*, a delay.',
    },
  },
  'fr.u8.l2.s6': {
    because: '*Suivant* means following, so *le train suivant* is the next train.',
    why: {
      'the last train': 'The last train is *le dernier train*.',
      'the following day': 'The following day is *le lendemain*. *Train* is still in the phrase.',
      'the direct train': 'The direct train is *le train direct*.',
    },
  },
  'fr.u8.l2.s9': {
    because: 'The agent has just given a platform, so Sarah asks where *le quai* is.',
    why: {
      billet: '*Le billet* is the ticket. She asks which way to go, so it is the platform.',
      retard: '*Le retard* is the delay. You cannot walk towards a delay.',
      guichet: '*Le guichet* is the ticket office. The agent was talking about the platform.',
    },
  },
  'fr.u8.l2.s10': {
    because: '*Une correspondance* is a connection: you change trains in Avignon.',
    why: {
      'You have a reservation in Avignon.': 'A reservation is *une réservation*.',
      'You arrive in Avignon.': 'You arrive is *vous arrivez*. A connection means you go on from there.',
      'Your train is cancelled in Avignon.': 'Cancelled is *annulé*, which is not in the sentence.',
    },
  },
  'fr.u8.l2.s14': {
    because: '*Rater* takes *avoir*: *j\'ai raté mon train*.',
    why: {
      'Je suis raté mon train.': '*Rater* is something you do to the train, so it takes *avoir*, not *être*.',
      "J'ai raté mon bus.": '*Bus* is a bus. The sentence is about a train.',
      'Mon train est en retard.': 'This means my train is late. You missed it, so it left without you.',
    },
  },
  'fr.u8.l2.s15': {
    because: '*Échanger mon billet* is to change my ticket, here for a seat on the next train.',
    why: {
      rembourser: '*Rembourser* is to refund. You want the next train, not your money back.',
      rater: '*Rater* is to miss. You do not want to miss the next train too.',
      annuler: '*Annuler* is to cancel. Then you would have no train at all.',
    },
  },

  /* Lesson 3: À l'hôtel */
  'fr.u8.l3.s3': {
    because: '*J\'ai réservé* means I\'ve booked, and *pour deux nuits* is for two nights.',
    why: {
      "I'd like a room for two nights.": "I'd like is *je voudrais*. *J'ai réservé* is done already: I've booked.",
      "I've booked a room for two people.": 'Two people is *deux personnes*. *Nuits* are nights.',
      "I've booked two rooms for one night.": '*Une chambre* is one room, and *deux nuits* is two nights.',
    },
  },
  'fr.u8.l3.s5': {
    because: '*Au nom de* means in the name of. You give the name the booking is under.',
    why: {
      prénom: '*Prénom* is a first name. Bookings go under *au nom de*.',
      numéro: '*Numéro* is a number. *Au numéro de* does not mean in the name of.',
      non: '*Non* sounds the same but means no. The noun is spelt *nom*.',
    },
  },
  'fr.u8.l3.s6': {
    because: '*La clé* is the key, also spelt *la clef*.',
    why: {
      'the room': 'The room is *la chambre*.',
      'the lift': 'The lift is *l\'ascenseur*.',
      'the bill': 'At a hotel, the bill is *la note*.',
    },
  },
  'fr.u8.l3.s9': {
    because: '*Compris* means included: *le petit-déjeuner est compris ?*',
    why: {
      comprend: '*Comprend* means understands. Breakfast does not understand anything.',
      complet: '*Complet* means full, like a hotel with no rooms left.',
      compte: '*Compte* means counts or account. Included is *compris*.',
    },
  },
  'fr.u8.l3.s10': {
    because: '*Ne marche pas* means does not work. *Le wifi* is the same word as in English.',
    why: {
      'The wifi works well.': 'Works well is *marche bien*. The *ne… pas* makes it negative.',
      "There's no wifi.": "There's no wifi is *il n'y a pas de wifi*. Here the wifi exists but is broken.",
      "The lift doesn't work.": 'The lift is *l\'ascenseur*. She said *le wifi*.',
    },
  },
  'fr.u8.l3.s14': {
    because: '*La chambre* is feminine, so the adjective takes an e: *bruyante*.',
    why: {
      'La chambre est bruyant.': '*Bruyant* is the masculine form. *Chambre* is feminine, so *bruyante*.',
      'La chambre est calme.': '*Calme* means quiet, the opposite of noisy.',
      'La chambre est plus calme.': 'This means the room is quieter. You want to say it is noisy.',
    },
  },

  /* Lesson 4: Raconter un voyage */
  'fr.u8.l4.s3': {
    because: '*On a vu* is the past of *voir*: we saw. *La mer* is the sea.',
    why: {
      'Yesterday, we went to the sea.': 'We went is *on est allés*. *On a vu* is we saw.',
      "Tomorrow, we're going to see the sea.": '*Hier* is yesterday, and *on a vu* is already done.',
      'Yesterday, we saw my mother.': '*La mer* (sea) sounds like *la mère* (mother), but my mother is *ma mère*.',
    },
  },
  'fr.u8.l4.s5': {
    because: 'Weather uses *faire*: *il fait beau* in the present, *il a fait beau* in the past.',
    why: {
      été: '*Été* is the past form of *être*. Weather phrases use *faire*: *il a fait beau*.',
      fais: '*Fais* goes with *je* or *tu*. After *il a*, you need the past form *fait*.',
      faire: '*Faire* is the infinitive. After *il a*, you need *fait*.',
    },
  },
  'fr.u8.l4.s6': {
    because: '*J\'ai visité* is the past: I visited. *Le musée* is the museum.',
    why: {
      "I'm visiting the museum.": "I'm visiting is the present, *je visite*.",
      "I'm going to visit the museum.": "I'm going to visit is *je vais visiter*.",
      'I visited the market.': 'The market is *le marché*. *Le musée* is the museum.',
    },
  },
  'fr.u8.l4.s8': {
    because: '*Arriver* takes *être*, and *on* uses *est*: *on est arrivées*.',
    why: {
      a: '*A* is from *avoir*. *Arriver* is a coming-and-going verb, so it takes *être*.',
      sont: '*Sont* goes with *ils* and *elles*. *On* takes *est*, even when it means we.',
      ont: '*Ont* is *avoir* with *ils*. *On* needs *est* here.',
    },
  },
  'fr.u8.l4.s11': {
    because: 'Verbs with *me*, *te*, *se* always take *être* in the past: *je me suis levée*.',
    why: {
      ai: '*Se lever* has *me* in front, so it uses *être*, not *avoir*.',
      me: '*Me* is already there. The gap needs the helping verb, *suis*.',
      est: '*Est* goes with *il* or *elle*. With *je*, *être* is *suis*.',
    },
  },
  'fr.u8.l4.s12': {
    because: "*On s'est promenées* is we went for a walk. *Le port* is the harbour.",
    why: {
      'We went to the harbour by boat.': 'By boat is *en bateau*. *Se promener* is to walk.',
      "We're going for a walk by the harbour.": "That is the near future, *on va se promener*. *On s'est promenées* has happened.",
      'We ate by the harbour.': 'We ate is *on a mangé*.',
    },
  },
  'fr.u8.l4.s17': {
    because: 'Sarah says the train was late but they arrived, and ends with *c\'était génial*: it was brilliant.',
    why: {
      'Sarah missed her train and stayed in Lyon.': "She says *on est arrivées*: they did arrive in Marseille.",
      'Sarah went to Marseille on her own, for work.': 'She went *avec Léa*, and walked by the harbour and visited a basilica.',
      'Sarah is going to Marseille next weekend.': 'Every verb is in the past: *je suis allée*, *on est arrivées*. It already happened.',
    },
  },
  'fr.u8.l4.s18': {
    because: '*Le lendemain* means the next day: the day after the one you are talking about.',
    why: {
      demain: '*Demain* is tomorrow, from today. *Le demain* is not French.',
      hier: '*Hier* is yesterday, and it never takes *le*.',
      matin: '*Le matin* means in the morning, not the next day.',
    },
  },

  /* Checkpoint */
  'fr.u8.check.s1': {
    because: '*Annulé* is cancelled, and *pour Paris* means to Paris.',
    why: {
      'The train to Paris is late.': 'Late is *en retard*. *Annulé* means it is not running.',
      'The train from Paris is cancelled.': 'From Paris is *de Paris*. *Pour Paris* is to Paris.',
      'The train to Paris has left.': 'Has left is *est parti*.',
    },
  },
  'fr.u8.check.s3': {
    because: 'Léa and Chloé are two women, so the past form adds *es*: *parties*.',
    why: {
      partis: '*Partis* is for men or a mixed group. Two women take *parties*.',
      partie: '*Partie* is for one woman. There are two, so it needs an s.',
      parti: '*Parti* is for one man.',
    },
  },
  'fr.u8.check.s4': {
    because: '*Arriver* is a coming-and-going verb: *je suis arrivé(e)*.',
    why: {
      manger: '*Manger* takes *avoir*: *j\'ai mangé*.',
      visiter: '*Visiter* takes *avoir*: *j\'ai visité*.',
      prendre: '*Prendre* takes *avoir*: *j\'ai pris*.',
    },
  },
  'fr.u8.check.s5': {
    because: '*Réserver* takes *avoir*, so the past form *réservé* never agrees with the speaker.',
    why: {
      réservée: 'Only *être* verbs agree with the speaker. With *avoir*, a woman also says *j\'ai réservé*.',
      réserver: '*Réserver* is the infinitive. After *j\'ai*, use the past form.',
      réserve: '*Réserve* is the present. After *j\'ai*, you need *réservé*.',
    },
  },
  'fr.u8.check.s8': {
    because: '*Je me suis levée à sept heures*: I got up at seven. *Je suis partie à huit heures*: I left at eight.',
    why: {
      'I got up at eight and left at seven.': 'The times are the other way round: up at *sept*, left at *huit*.',
      'I went to bed at seven and left at eight.': 'I went to bed is *je me suis couchée*. *Levée* is got up.',
      'I get up at seven and leave at eight.': 'That is the present. *Je me suis levée* and *je suis partie* are past.',
    },
  },
  'fr.u8.check.s9': {
    because: "*C'était* means it was, and *génial* is brilliant.",
    why: {
      "It's brilliant!": "It's brilliant is *c'est génial*. *C'était* is the past.",
      'It was expensive!': 'Expensive is *cher*.',
      'It was a long time ago!': 'A long time ago is *il y a longtemps*.',
    },
  },
}
