import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 5's exercises.
export const explain5: Record<string, Explanation> = {
  'fr.u5.l1.s3': {
    because: "*Où est… ?* asks where something is, so *Excusez-moi, où est la gare ?* is the polite way to ask for the station.",
    why: {
      'Excusez-moi, la gare est loin ?': "This asks if the station is far, not where it is. *Loin* means far.",
      'Excusez-moi, il y a une gare ?': "This asks whether there is a station at all. *Il y a* means there is or there are.",
      'Excusez-moi, la gare, à quelle heure ?': "*À quelle heure* asks about a time, not a place, so this doesn't ask for directions.",
    },
  },
  'fr.u5.l1.s6': {
    because: "*Musée* is masculine (*le musée*), and *à* + *le* always merges into *au*: *pour aller au musée*.",
    why: {
      'à la': "*À la* is for feminine places, like *à la gare*. *Musée* is masculine, so it takes *au*.",
      'à le': "French never says *à le*: it always shortens to *au*.",
      aux: "*Aux* is for plurals, like *aux toilettes*. There's only one museum here.",
    },
  },
  'fr.u5.l1.s9': {
    because: "*Tournez* means turn, and *à droite* means on the right, so *Tournez à droite* is turn right.",
    why: {
      'Turn left.': "Turn left would be *Tournez à gauche*. Listen for the end: *droite* has a clear \"t\" sound, *gauche* ends softly.",
      'Go straight on.': "Go straight on is *Allez tout droit*. It starts with *allez*, not *tournez*.",
      'It’s at the end of the street.': "That would be *C'est au bout de la rue*, with no *tournez* in it.",
    },
  },
  'fr.u5.l1.s10': {
    because: "*Allez* means go and *tout droit* means straight on. Note *tout droit* with no *à*, unlike *à droite*.",
    why: {
      'Turn right.': "Turn right is *Tournez à droite*. *Droit* and *droite* look alike, but *tout droit* is straight on.",
      'Take the first street.': "That would be *Prenez la première rue*, starting with *prenez* (take).",
      'Go left.': "Left is *à gauche*. You heard *tout droit*, which means straight on.",
    },
  },
  'fr.u5.l1.s15': {
    because: "*Au bout de la rue* is a fixed phrase meaning at the end of the street. *La rue* is the street.",
    why: {
      coin: "*Le coin* is the corner, as in *au coin*. It's masculine, so it wouldn't follow *de la* anyway.",
      droite: "*Droite* means right, as in *à droite*. *Au bout de la droite* makes no sense.",
      pied: "*Pied* means foot, as in *à pied* (on foot). It isn't a place you reach the end of.",
    },
  },
  'fr.u5.l1.s16': {
    because: "*Il y a* means there is, and *au coin* means on the corner: there's a chemist's on the corner.",
    why: {
      "There's a chemist's at the end of the street.": "At the end of the street is *au bout de la rue*. Here you have *au coin*, the corner.",
      "The chemist's is on the left.": "That would be *La pharmacie est à gauche*. There's no *à gauche* in the sentence.",
      "Is there a chemist's nearby?": "This sentence is a statement, not a question. A question would be *Il y a une pharmacie près d'ici ?*",
    },
  },
  'fr.u5.l1.s19': {
    because: "*Cinq minutes* is five minutes and *à pied* means on foot, so it's five minutes' walk.",
    why: {
      "It's fifteen minutes' walk.": "Fifteen is *quinze*, which starts with a \"k\" sound. *Cinq* starts with an \"s\" sound.",
      "It's five minutes by car.": "By car is *en voiture*. You heard *à pied*, which means on foot.",
      'Is it far?': "Is it far? is *C'est loin ?* This sentence gives the distance instead.",
    },
  },
  'fr.u5.l2.s3': {
    because: "*Le métro* is the underground, the city's train system that runs below the streets.",
    why: {
      'the bus': "The bus is *le bus*, with the French *u* sound and a pronounced final *s*.",
      'the train': "The train is *le train*, a short word with a nasal ending.",
      'the bike': "The bike is *le vélo*. It also ends in an \"o\" sound, but starts with \"v\".",
    },
  },
  'fr.u5.l2.s6': {
    because: "*Le vélo* is the bike. To say by bike, use *à vélo*.",
    why: {
      'the car': "The car is *la voiture*, as in *en voiture* (by car).",
      'on foot': "On foot is *à pied*.",
      'the tram': "The tram is *le tram*, almost the same as in English.",
    },
  },
  'fr.u5.l2.s9': {
    because: "You sit inside a train, so it takes *en*: *en train*, like *en bus* and *en voiture*.",
    why: {
      à: "*À* is for things you ride on top of or for your feet: *à vélo*, *à pied*.",
      au: "*Au* means to the or at the, as in *au musée*. It doesn't mean by.",
      par: "*Par* doesn't go straight before *train* here. For transport, use *en* or *à*.",
    },
  },
  'fr.u5.l2.s10': {
    because: "Walking is always *à pied*, just as cycling is *à vélo*. You aren't inside anything, so it isn't *en*.",
    why: {
      en: "*En* is for transport you travel inside: *en train*, *en voiture*. Feet take *à*.",
      au: "*Au* is *à* + *le*, but *pied* has no article here: the phrase is simply *à pied*.",
      par: "*Par pied* isn't French. The set phrase for on foot is *à pied*.",
    },
  },
  'fr.u5.l2.s13': {
    because: "*Un aller-retour* is a return ticket, literally a going-and-coming-back.",
    why: {
      "Un aller simple pour Annecy, s'il vous plaît.": "*Un aller simple* is a single: just the outward journey, with no return.",
      "Le train pour Annecy, s'il vous plaît.": "This asks for the train to Annecy, not a ticket. It doesn't mention a return.",
      'Un billet pour Annecy, c\'est combien ?': "This asks how much a ticket to Annecy is. It doesn't ask for a return.",
    },
  },
  'fr.u5.l2.s15': {
    because: "*La voie* is the track, so *de la voie sept* means from track 7.",
    why: {
      'The train leaves at seven.': "At seven would be *à sept heures*. You heard *de la voie*, so it's the track.",
      'The train leaves from track 17.': "Seventeen is *dix-sept*, with *dix* (\"deess\") in front. You heard just *sept*.",
      'The train arrives at seven.': "*Part* is from *partir*, to leave. Arrives would be *arrive*, and seven o'clock *à sept heures*.",
    },
  },
  'fr.u5.l2.s19': {
    because: "With *tu*, *aller* becomes *vas*: *tu vas à Lyon demain ?*",
    why: {
      vais: "*Vais* goes with *je*: *je vais à Lyon*.",
      va: "*Va* goes with *il*, *elle* and *on*: *elle va à Lyon*.",
      allez: "*Allez* goes with *vous*: *vous allez à Lyon ?*",
    },
  },
  'fr.u5.l3.s3': {
    because: "*Juin* is June. It's one short syllable, a bit like \"zhwan\" said through the nose.",
    why: {
      July: "July is *juillet*, which has two syllables and ends in an \"ay\" sound: \"zhwee-yay\".",
      January: "January is *janvier*, two syllables: \"zhon-vyay\".",
      May: "May is *mai*, which sounds like \"meh\".",
    },
  },
  'fr.u5.l3.s6': {
    because: "*Avril* is April. The two look alike, which makes it an easy one to remember.",
    why: {
      August: "August is *août*, a very short word sounding like \"oot\" or \"oo\".",
      May: "May is *mai*.",
      March: "March is *mars*, with the final s pronounced.",
    },
  },
  'fr.u5.l3.s7': {
    because: "The year starts *janvier, février, mars, avril*, so February is *février*.",
    why: {
      juin: "*Juin* is June, the sixth month.",
      mai: "*Mai* is May, which comes after *avril*.",
      mardi: "*Mardi* is Tuesday, a day of the week, not a month. It looks a bit like *mars*.",
    },
  },
  'fr.u5.l3.s9': {
    because: "*Août* is August. It's said as one short sound, \"oot\" or just \"oo\".",
    why: {
      October: "October is *octobre*, said \"ok-tobr\", with a clear \"k\".",
      April: "April is *avril*, which ends in a clear \"eel\" sound.",
      June: "June is *juin*, which starts with a \"zh\" sound.",
    },
  },
  'fr.u5.l3.s11': {
    because: "*Juillet* is July. Think of the national holiday, *le quatorze juillet*.",
    why: {
      June: "June is *juin*, the shorter one. *Juillet* is the longer word and the later month.",
      January: "January is *janvier*.",
      Tuesday: "Tuesday is *mardi*, a day of the week, not a month.",
    },
  },
  'fr.u5.l3.s13': {
    because: "*Novembre* is November. Listen for the \"no\" at the start.",
    why: {
      September: "September is *septembre*, which starts with \"sep\".",
      December: "December is *décembre*, which starts with \"day\".",
      October: "October is *octobre*, which ends in \"obr\" with no \"embr\" sound.",
    },
  },
  'fr.u5.l3.s16': {
    because: "The first of the month is the only date that uses *premier*: *le premier mai*.",
    why: {
      un: "Other dates use plain numbers, like *le deux mai*, but the first is always *le premier*, never *le un*.",
      une: "*Une* is feminine and a plain number. Dates take *le*, and the first is *le premier*.",
      première: "*Première* is the feminine form, as in *la première rue*. A date goes with *le*, so it's *premier*.",
    },
  },
  'fr.u5.l3.s18': {
    because: "*On est le combien aujourd'hui ?* is the everyday way to ask the date. Answer with *on est le…*.",
    why: {
      "C'est combien ?": "*C'est combien ?* asks how much something costs.",
      'Quelle heure est-il ?': "*Quelle heure est-il ?* asks the time, not the date.",
      "C'est quand, ton anniversaire ?": "This asks when someone's birthday is.",
    },
  },
  'fr.u5.l3.s20': {
    because: "*Trente et un* is 31 and *octobre* is October, so the birthday is 31 October.",
    why: {
      '30 October': "30 is just *trente*. You heard *et un* after it, which makes 31.",
      '21 October': "21 is *vingt et un*, starting with \"van\". You heard *trente* (\"tront\").",
      '31 August': "August is *août*, one short sound. You heard *octobre*.",
    },
  },
  'fr.u5.l4.s3': {
    because: "*Rester* means to stay, as in *Tu vas rester à Lyon ?* It doesn't mean to rest.",
    why: {
      'to leave': "To leave is *partir*: *on va partir à huit heures*.",
      'to visit': "To visit a place is *visiter*.",
      'to do': "To do or to make is *faire*.",
    },
  },
  'fr.u5.l4.s5': {
    because: "*Partir* means to leave: *je pars samedi* is I'm leaving on Saturday.",
    why: {
      'to stay': "To stay is *rester*, which starts with a French \"r\" and has an \"eh\" sound.",
      'to do': "To do is *faire*, which sounds like \"fair\".",
      'to visit': "To visit is *visiter*, with three syllables: \"vee-zee-tay\".",
    },
  },
  'fr.u5.l4.s9': {
    because: "With *je*, *aller* is *vais*. Add a verb in its dictionary form for the near future: *je vais visiter*.",
    why: {
      vas: "*Vas* goes with *tu*: *tu vas visiter Annecy*.",
      va: "*Va* goes with *il*, *elle* and *on*: *on va visiter Annecy*.",
      suis: "*Suis* is from *être* (to be). The near future uses *aller*, not *être*.",
    },
  },
  'fr.u5.l4.s11': {
    because: "*Qu'est-ce que* means what, and *tu vas faire* means you're going to do.",
    why: {
      'Où est-ce que tu vas ?': "*Où* means where, so this asks where you're going.",
      'Tu vas bien ?': "*Tu vas bien ?* means are you well? Here *aller* is about how you are.",
      "Qu'est-ce que tu prends ?": "This asks what you're having, for example in a café. *Prends* is from *prendre*.",
    },
  },
  'fr.u5.l4.s15': {
    because: "*Été* is masculine and starts with a vowel sound, so this takes *cet*: *cet été*.",
    why: {
      Ce: "*Ce* is for masculine words starting with a consonant, like *ce soir*. Before a vowel it becomes *cet*.",
      Cette: "*Cette* is for feminine words, like *cette semaine*. *Été* is masculine.",
      Le: "*Le* would shorten to *l'été*, which means summer in general, not this summer.",
    },
  },
  'fr.u5.l4.s17': {
    because: "*Le mois prochain* is next month, and *on va partir en Italie* is we're going off to Italy.",
    why: {
      'Next week, we\'re going off to Italy.': "Next week is *la semaine prochaine*. You heard *le mois*, the month.",
      "This month, we're in Italy.": "This month would be *ce mois-ci*. *On va partir* is about the future, not now.",
      "Next month, we're leaving Italy.": "Leaving Italy would be *partir d'Italie*. *En Italie* means to Italy.",
    },
  },
  'fr.u5.check.s1': {
    because: "*Tournez à gauche* is turn left, then *puis allez tout droit* is then go straight on.",
    why: {
      'Turn right, then go straight on.': "Right is *à droite*. You heard *à gauche*, which ends in a soft \"sh\" sound.",
      'Go straight on, then turn left.': "The order is reversed. *Puis* means then, and *tournez à gauche* came first.",
      'Turn left at the end of the street.': "At the end of the street is *au bout de la rue*, which wasn't said.",
    },
  },
  'fr.u5.check.s3': {
    because: "*À* + *le musée* becomes *au musée*. *À pied* at the end tells you how you're going.",
    why: {
      'à la': "*À la* is for feminine places, like *à la gare*. *Le musée* is masculine.",
      en: "*En* is for some transport, like *en train*, or feminine countries, like *en France*. Not for *musée*.",
      'à le': "*À le* always merges into *au* in French.",
    },
  },
  'fr.u5.check.s4': {
    because: "*Dix heures vingt* is 10:20, and *voie trois* is track 3.",
    why: {
      '10:30, track 3': "10:30 would be *dix heures trente* or *et demie*. You heard *vingt* (\"van\").",
      '10:20, track 13': "13 is *treize* (\"trez\"). You heard *trois* (\"trwah\").",
      '12:20, track 3': "12:20 would be *douze heures vingt* or *midi vingt*. You heard *dix* (\"deess\").",
    },
  },
  'fr.u5.check.s6': {
    because: "*Loin* means far, so *c'est loin ?* asks is it far?",
    why: {
      'Excuse me, where is it?': "Where is it? is *C'est où ?*, with *où* meaning where.",
      'Excuse me, is it on the left?': "On the left is *à gauche*: *c'est à gauche ?*",
      'Excuse me, what time is it?': "What time is it? is *Quelle heure est-il ?*",
    },
  },
}
