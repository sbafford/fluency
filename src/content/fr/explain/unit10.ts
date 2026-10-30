import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 10's exercises.
export const explain10: Record<string, Explanation> = {
  'fr.u10.l1.s3': {
    because: "*J'habitais* is the imparfait of *habiter*: I lived, or I used to live. *Quand j'étais petite* sets it in childhood.",
    why: {
      'When I was little, I went to Perth.': "Went to would be *je suis allée*. *J'habitais* means lived.",
      'Now I live in Perth.': "Now I live would be *maintenant, j'habite*. The sentence starts with *quand j'étais petite*, so it is the past.",
      'When I was little, I loved Perth.': "Loved would be *j'aimais*. The verb here is *habiter*, to live.",
    },
  },
  'fr.u10.l1.s6': {
    because: '*Tous les étés* shows a habit, and a habit in the past takes the imparfait: *on allait*, we used to go.',
    why: {
      'Cet été, on est allés à la plage.': 'This is one summer, *cet été*, and one trip in the passé composé. It is not a habit.',
      'Tous les étés, on va à la plage.': '*On va* is the present: we go every summer, still now. You need the past habit, *on allait*.',
      'Cet été, on va aller à la plage.': 'This is the near future: this summer, we are going to go.',
    },
  },
  'fr.u10.l1.s7': {
    because: '*Le dimanche* means every Sunday, a habit. With *on*, the imparfait of *aller* is *on allait*.',
    why: {
      va: '*On va* is the present: we go to the beach on Sundays now.',
      'est allés': '*On est allés* is the passé composé: one trip that happened once, not a habit.',
      allais: '*Allais* goes with *je* or *tu*. With *on*, the ending is *-ait*: *on allait*.',
    },
  },
  'fr.u10.l1.s9': {
    because: 'Mamie is one person, so the ending is *-ait*: *elle aimait*, she used to love.',
    why: {
      aimais: '*Aimais* goes with *je* or *tu*. For Mamie, *elle*, write *aimait*.',
      aimaient: '*Aimaient* is for *ils* or *elles*, several people.',
      aime: '*Aime* is the present: she loves animals now. The sentence is about the past.',
    },
  },
  'fr.u10.l1.s10': {
    because: '*Je jouais* is the imparfait of *jouer*: I used to play. *Au foot* is football.',
    why: {
      "I'm playing football with my brother.": "That would be the present, *je joue*. *Jouais* ends in *-ais*, the past.",
      'My brother used to play football.': 'The subject is *je*, I. My brother would be *mon frère jouait*.',
      'I watched football with my brother.': 'Watched would be *je regardais*. *Jouer au foot* is to play it.',
    },
  },
  'fr.u10.l1.s15': {
    because: '*Souvent* means often.',
    why: {
      sometimes: 'Sometimes is *parfois* or *de temps en temps*.',
      never: 'Never is *jamais*.',
      always: 'Always is *toujours*.',
    },
  },
  'fr.u10.l2.s3': {
    because: '*Il y avait* is the imparfait of *il y a*: there was, or there were.',
    why: {
      'there is': 'There is, now, is *il y a*. *Avait* puts it in the past.',
      'it was': "It was is *c'était*.",
      'he had': 'He had is *il avait*, without *y*. With *y*, it means there was.',
    },
  },
  'fr.u10.l2.s4': {
    because: '*Il y avait* means there was. The fixed phrase uses *avoir*: *il y a*, *il y avait*.',
    why: {
      a: "*Il y a* is the present: there is. The garden was at your parents' place in the past.",
      était: '*Il y était* means he was there. There was always uses *avoir*: *il y avait*.',
      avais: '*Avais* goes with *je* or *tu*. The phrase is always *il y avait*.',
    },
  },
  'fr.u10.l2.s7': {
    because: '*Il pleuvait* means it was raining, and *il faisait froid* means it was cold. *Ce jour-là* is that day.',
    why: {
      'That day, it was sunny and cold.': 'Sunny would be *il y avait du soleil*. You heard *il pleuvait*, it was raining.',
      "Today, it's raining and cold.": "Today, it's raining is *aujourd'hui, il pleut*. You heard *ce jour-là* and the imparfait.",
      'That day, it was raining and hot.': 'Hot would be *il faisait chaud*. You heard *froid*, cold.',
    },
  },
  'fr.u10.l2.s8': {
    because: 'Weather uses *faire*: *il fait chaud*. In the past, that becomes *il faisait chaud*.',
    why: {
      était: 'French says the weather "makes" hot: *il faisait chaud*, not *il était chaud*.',
      avait: '*Il avait chaud* means he felt hot. For the weather, use *il faisait*.',
      fait: '*Il fait* is the present: it is hot now. The translation says it was.',
    },
  },
  'fr.u10.l2.s10': {
    because: "Age uses *avoir*: *j'ai dix ans*, I am ten. In the past, *j'avais dix ans*, I was ten.",
    why: {
      "J'étais dix ans.": "French never uses *être* for age. You *have* years: *j'avais dix ans*.",
      "J'ai dix ans.": "*J'ai dix ans* is the present: I am ten.",
      "J'ai eu dix ans.": "*J'ai eu dix ans* means I turned ten, on one day. I was ten describes that time: *j'avais*.",
    },
  },
  'fr.u10.l2.s11': {
    because: '*Je voulais* is the imparfait of *vouloir*: I wanted. *Vétérinaire* is a vet.',
    why: {
      'I want to be a vet.': 'I want is *je veux*, the present. *Voulais* is the past.',
      'I was a vet.': "I was a vet would be *j'étais vétérinaire*. *Je voulais être* means I wanted to be.",
      'I would like to be a vet.': "I would like is *je voudrais*. It sounds close, but *voulais* is the past.",
    },
  },
  'fr.u10.l2.s13': {
    because: "*C'était* gives a general comment, and the adjective stays in its basic form: *c'était beau*.",
    why: {
      'Il était': '*Plage* is feminine, so it would be *elle*, not *il*.',
      'Elle était': "*Elle était* needs the adjective to agree: *elle était très belle*. With *beau*, use *c'était*.",
      "C'est": "*C'est* is the present. The sentence is about how the beach was.",
    },
  },
  'fr.u10.l3.s3': {
    because: '*Avant, il y avait des usines*: there used to be factories. *Maintenant, il y a un parc*: now there is a park.',
    why: {
      'There used to be a park. Now there are factories.': 'This swaps them round. The factories come with *avant*, the past.',
      'There are factories and a park.': 'This misses the change. *Avant* and *maintenant* contrast then and now.',
      'There will be a park instead of the factories.': 'There will be is the future, *il y aura*. You heard *il y a*, there is now.',
    },
  },
  'fr.u10.l3.s6': {
    because: 'Cheaper is *moins cher*, less expensive, with *que* before the thing you compare.',
    why: {
      'Le bus est plus cher que le taxi.': '*Plus cher* means more expensive, the opposite.',
      'Le bus est aussi cher que le taxi.': '*Aussi cher* means as expensive as.',
      'Le bus est moins cher de le taxi.': 'Comparisons use *que*, not *de*: *moins cher que*.',
    },
  },
  'fr.u10.l3.s7': {
    because: 'Bigger is *plus grand*, more big. *Que* introduces the other city.',
    why: {
      moins: '*Moins grand* means smaller, less big.',
      aussi: '*Aussi grand que* means as big as.',
      très: '*Très* means very. It does not compare, so it cannot work with *que*.',
    },
  },
  'fr.u10.l3.s8': {
    because: 'Every comparison takes *que*: *aussi belle que*, as beautiful as.',
    why: {
      comme: '*Comme* means like. After *aussi*, French always uses *que*.',
      de: '*De* does not make a comparison with an adjective. Use *que*.',
      plus: '*Plus* would need to come before the adjective, and *aussi* is already there.',
    },
  },
  'fr.u10.l3.s11': {
    because: '*Meilleur* is the adjective better, from *bon*. It describes the noun *pain*.',
    why: {
      mieux: '*Mieux* goes with verbs, as in *je parle mieux*. To describe the bread, use *meilleur*.',
      'plus bon': '*Bon* is irregular: never *plus bon*, always *meilleur*.',
      bon: '*Bon* means good. The sentence needs better.',
    },
  },
  'fr.u10.l3.s12': {
    because: '*Mieux* is better with a verb. Here it says how you speak: *je parle mieux*.',
    why: {
      meilleur: '*Meilleur* describes a noun, as in *le pain est meilleur*. With *parler*, use *mieux*.',
      'plus bien': '*Bien* is irregular: never *plus bien*, always *mieux*.',
      bien: '*Bien* means well. The sentence needs better.',
    },
  },
  'fr.u10.l3.s14': {
    because: '*Plus de* + a noun means more: *plus de vélos*, more bikes.',
    why: {
      'There are fewer bikes.': 'Fewer bikes is *moins de vélos*.',
      'There are as many bikes.': 'As many bikes is *autant de vélos*.',
      'There are no bikes.': "No bikes is *il n'y a pas de vélos*. *Plus de* + a noun means more.",
    },
  },
  'fr.u10.l4.s3': {
    because: '*Il pleuvait* sets the scene: it was raining. *Quand je suis arrivée* is the moment: when I arrived.',
    why: {
      'It rained after I arrived.': 'After I arrived would be *après mon arrivée*. You heard *quand*, when.',
      "It's raining, so I'm coming.": 'Both verbs are in the past here: *pleuvait* and *suis arrivée*.',
      'It was raining when I left.': 'Left would be *je suis partie*. You heard *arrivée*, arrived.',
    },
  },
  'fr.u10.l4.s6': {
    because: 'Sleeping is the background, in the imparfait: *je dormais*. The phone ringing is the event: *a sonné*.',
    why: {
      "J'ai dormi quand le téléphone sonnait.": 'This swaps the tenses. The sleep is the scene, *je dormais*, and the ring is the event.',
      'Je dors quand le téléphone sonne.': 'This is the present: I sleep when the phone rings.',
      "J'ai dormi quand le téléphone a sonné.": "*J'ai dormi* is a finished event. Was sleeping is the background: *je dormais*.",
    },
  },
  'fr.u10.l4.s7': {
    because: 'The rain is the background when you arrived, so it takes the imparfait: *il pleuvait*.',
    why: {
      'a plu': '*Il a plu* means it rained, as a finished event. Was raining is the scene: *il pleuvait*.',
      pleut: '*Il pleut* is the present: it is raining now.',
      pleuvais: '*Pleuvais* goes with *je* or *tu*. Weather always uses *il*: *il pleuvait*.',
    },
  },
  'fr.u10.l4.s8': {
    because: '*Arriver* takes *être* in the passé composé. With Hugo, *il*, that is *est*: *Hugo est arrivé*.',
    why: {
      a: '*Arriver* is one of the verbs of coming and going that take *être*, not *avoir*.',
      es: '*Es* goes with *tu*. Hugo is *il*, so *est*.',
      sont: '*Sont* is for *ils* or *elles*. Hugo is one person: *est*.',
    },
  },
  'fr.u10.l4.s11': {
    because: '*Tout à coup* means suddenly. It brings in an event.',
    why: {
      'one day': 'One day is *un jour*.',
      while: 'While is *pendant que*.',
      'at first': "At first is *d'abord* or *au début*.",
    },
  },
  'fr.u10.l4.s12': {
    because: '*Pendant que* means while. It brings in the background action: *je dormais*.',
    why: {
      'Tout à coup': 'Suddenly brings in an event, and *je dormais* is background. The translation says while.',
      'Un jour': 'One day starts a story, but the translation says while.',
      Pendant: '*Pendant* alone goes before a noun: *pendant la nuit*. Before a verb, use *pendant que*.',
    },
  },
  'fr.u10.l4.s14': {
    because: "*C'était la première fois* means it was the first time. *Je voyais la neige* is I saw snow.",
    why: {
      'It was the last time I saw snow.': 'The last time is *la dernière fois*. You heard *première*, first.',
      'It snowed for the first time that year.': 'It snowed would be *il a neigé*. The sentence is about you seeing the snow.',
      'I saw snow every winter.': 'Every winter would be *tous les hivers*. You heard *la première fois*.',
    },
  },
  'fr.u10.check.s1': {
    because: "*Quand j'étais petite* sets the time, and *je jouais … tous les jours* is a habit: I played every day.",
    why: {
      'When I was little, I played football one day.': 'One day is *un jour*. You heard *tous les jours*, every day.',
      'I play football every day.': 'I play is *je joue*, the present. *Je jouais* is the past.',
      'When I was little, I watched football every day.': 'Watched would be *je regardais*. *Jouer au foot* is to play it.',
    },
  },
  'fr.u10.check.s2': {
    because: '*Avant* points to the past, so *il y a* becomes *il y avait*: there used to be.',
    why: {
      a: '*Il y a* is the present. *Avant* tells you it was in the past.',
      était: 'There was always uses *avoir*: *il y avait*, not *il y était*.',
      avais: '*Avais* goes with *je* or *tu*. The phrase is always *il y avait*.',
    },
  },
  'fr.u10.check.s4': {
    because: '*Le dimanche* means every Sunday, and *on allait* is the imparfait: a past habit.',
    why: {
      'Dimanche, on est allés à la plage.': 'Without *le*, *dimanche* is one Sunday, and *on est allés* is one trip. That is an event.',
      'Le dimanche, on va à la plage.': 'This is a habit, but in the present: we go now.',
      'Dimanche, on va aller à la plage.': 'This is the near future: on Sunday, we are going to go.',
    },
  },
  'fr.u10.check.s5': {
    because: 'Better describing a noun is *meilleur*, from *bon*: *le café est meilleur*.',
    why: {
      mieux: '*Mieux* goes with verbs. To describe the coffee, use *meilleur*.',
      'plus bon': 'Never *plus bon*: better is always *meilleur*.',
      bien: '*Bien* means well. The sentence needs better.',
    },
  },
  'fr.u10.check.s8': {
    because: '*Pendant que je dormais* is the background, while I was sleeping. *Le téléphone a sonné* is the event.',
    why: {
      'While the phone was ringing, I slept.': 'This swaps the roles. *Pendant que* goes with *je dormais*, so you were the one sleeping.',
      'I slept, then the phone rang.': 'Then would be *ensuite* or *puis*. *Pendant que* means the two happened together.',
      'The phone rang, so I went to sleep.': 'So would be *donc*. *Je dormais* means you were already asleep when the phone rang.',
    },
  },
  'fr.u10.check.s9': {
    because: '*Arriver* takes *être*: *je suis arrivée*. The *e* on *arrivée* shows the speaker is a woman.',
    why: {
      ai: '*Arriver* takes *être*, not *avoir*: *je suis arrivée*.',
      es: '*Es* goes with *tu*. With *je*, it is *suis*.',
      sommes: '*Sommes* goes with *nous*. With *je*, it is *suis*.',
    },
  },
  'fr.u10.check.s11': {
    because: "*C'était* is the imparfait of *c'est*: it was.",
    why: {
      'it is': "It is, now, is *c'est*.",
      'there was': 'There was is *il y avait*.',
      'it will be': 'It will be is *ce sera*, the future.',
    },
  },
}
