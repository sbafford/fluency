import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 3's exercises.
export const explain3: Record<string, Explanation> = {
  'fr.u3.l1.s4': {
    because: "*Sœur* is feminine and singular, so 'my' is *ma*: *ma sœur*.",
    why: {
      'mon sœur': "*Mon* is for masculine words like *mon frère*. *Sœur* is feminine, so it takes *ma*.",
      'mes sœur': "*Mes* is for plurals: *mes sœurs* would be 'my sisters', with an *-s* on the noun too.",
      'ma frère': "*Frère* means brother, and it is masculine, so it would be *mon frère*.",
    },
  },
  'fr.u3.l1.s5': {
    because: "*Mon frère* is 'my brother'. Listen for the *r* sound at the start of *frère*, after the *f*.",
    why: {
      'my father': "'My father' is *mon père*: it starts with a *p* sound, not *fr*.",
      'my sister': "'My sister' is *ma sœur*: you would hear *ma*, and *sœur* starts with an *s* sound.",
      'my parents': "'My parents' is *mes parents*: *mes* sounds like 'may', and *parents* starts with *p*.",
    },
  },
  'fr.u3.l1.s7': {
    because: "*Parents* is plural, so 'my' is *mes*, whatever the gender: *mes parents*.",
    why: {
      Mon: "*Mon* is for one masculine thing, as in *mon père*. With a plural, use *mes*.",
      Ma: "*Ma* is for one feminine thing, as in *ma mère*. *Parents* is plural, so *mes*.",
      Me: "*Me* means 'me' or 'myself', as in *je m'appelle*. It isn't a word for 'my'.",
    },
  },
  'fr.u3.l1.s10': {
    because: "*Ma fille* is 'my daughter'. The *ll* sounds like a y: 'fee-y'.",
    why: {
      'my son': "'My son' is *mon fils*, said 'fiss': you would hear *mon* and an *s* sound at the end.",
      'my wife': "'My wife' is *ma femme*, which sounds like 'fam'.",
      'my children': "'My children' is *mes enfants*, linked as 'may-zon-fon'.",
    },
  },
  'fr.u3.l1.s12': {
    because: "*Mari* means husband, so *mon mari* is 'my husband'.",
    why: {
      'my brother': "'My brother' is *mon frère*.",
      'my father': "'My father' is *mon père*.",
      'my son': "'My son' is *mon fils*.",
    },
  },
  'fr.u3.l1.s17': {
    because: "'To have' is *avoir*, and with *tu* it is *tu as*. The *s* is silent.",
    why: {
      a: "*A* goes with *il* or *elle*: *il a des frères*. With *tu*, it's *tu as*.",
      es: "*Es* is from *être* (to be): *tu es* means 'you are'. Here you need 'have'.",
      ai: "*Ai* goes with *je*: *j'ai des frères*, 'I have brothers'.",
    },
  },
  'fr.u3.l1.s20': {
    because: "*Tu as* is 'you have', and *des enfants* is 'children', so it's 'Do you have children?'",
    why: {
      'Are you a child?': "That would be *Tu es un enfant ?*, with *es* (are) and *un*, not *as* and *des*.",
      'Do you have brothers and sisters?': "That would end in *des frères et sœurs*, not *des enfants*.",
      'Where are your children?': "That would start with *où* (where): *Où sont tes enfants ?* There's no *où* here.",
    },
  },
  'fr.u3.l2.s4': {
    because: "*Fille* is feminine, so the adjective adds *-e*: *petite*. Now you hear the final *t*.",
    why: {
      petit: "*Petit* is the masculine form, for *mon fils est petit*. A daughter needs *petite*.",
      petits: "*Petits* is masculine plural, for several boys or a mixed group.",
      grand: "*Grand* means tall, the opposite. And for a woman it would be *grande*.",
    },
  },
  'fr.u3.l2.s5': {
    because: "*Il* means he, and *grand* means tall for people. The *d* is silent in *grand*.",
    why: {
      'He is short.': "'He is short' is *il est petit*, a quite different word.",
      'He is young.': "'He is young' is *il est jeune*, which sounds like 'zhuhn'.",
      'She is tall.': "'She is tall' is *elle est grande*: you'd hear *elle* and a clear *d* at the end.",
    },
  },
  'fr.u3.l2.s9': {
    because: "*Timide* means shy. It already ends in *-e*, so it's the same for men and women.",
    why: {
      funny: "'Funny' is *drôle*.",
      kind: "'Kind' is *gentil*, or *gentille* for a woman.",
      young: "'Young' is *jeune*.",
    },
  },
  'fr.u3.l2.s10': {
    because: "*Mère* is feminine, so *gentil* doubles the *l* and adds *-e*: *gentille*.",
    why: {
      gentil: "*Gentil* is the masculine form: *ton père est gentil*. For your mother, use *gentille*.",
      gentils: "*Gentils* is masculine plural, for several people: *mes frères sont gentils*.",
      timides: "*Timides* means 'shy', and it's plural. You need 'kind' for one woman.",
    },
  },
  'fr.u3.l2.s12': {
    because: "*Un peu* means 'a little', and *timide* is shy. *Il* tells you it's a man.",
    why: {
      'He is very shy.': "'Very' is *très*: *il est très timide*. Here you hear *un peu*.",
      'He is a little funny.': "'Funny' is *drôle*, which sounds nothing like *timide*.",
      'She is a little shy.': "That would start with *elle*. *Timide* sounds the same for both, so listen to the start.",
    },
  },
  'fr.u3.l2.s16': {
    because: "Describing eyes uses *avoir*: *elle a les yeux bleus*. *Bleus* is plural to match *yeux*.",
    why: {
      'Elle est les yeux bleus.': "*Est* means 'is'. For eyes and hair, French says she 'has': *elle a*.",
      'Elle a les yeux bleu.': "*Yeux* is plural, so the colour takes an *-s* too: *bleus*.",
      'Elle a les cheveux bleus.': "*Les cheveux* is hair, so this says she has blue hair. Eyes are *les yeux*.",
    },
  },
  'fr.u3.l2.s17': {
    because: "Brown eyes are *les yeux marron*. *Marron* never changes: no *-s*, no *-e*.",
    why: {
      marrons: "A sensible guess, but *marron* never takes an *-s*, even with *yeux*.",
      blonds: "*Blonds* is for hair: *les cheveux blonds*. It doesn't describe eyes.",
      bleu: "*Bleu* means blue, not brown, and with *yeux* it would need an *-s*: *bleus*.",
    },
  },
  'fr.u3.l2.s20': {
    because: "*Il est comment ?* asks what someone is like, in looks or personality.",
    why: {
      'Il est où ?': "*Où* means where, so *il est où ?* is 'where is he?'",
      'Il a quel âge ?': "This asks 'how old is he?', using *avoir* for age.",
      "Il s'appelle comment ?": "This asks 'what's his name?' *S'appeler* is about names, not character.",
    },
  },
  'fr.u3.l3.s3': {
    because: "*Une maison* is a house. Listen for the 'z' sound in the middle: 'meh-zon'.",
    why: {
      'a flat': "'A flat' is *un appartement*, a longer word starting with *un*.",
      'a room': "A room is *une pièce*, and a bedroom is *une chambre*, which starts with a 'sh' sound.",
      'a street': "'A street' is *une rue*, a single short sound.",
    },
  },
  'fr.u3.l3.s5': {
    because: "*Dans* is for being inside something: *dans un appartement*, *dans la cuisine*.",
    why: {
      à: "*À* is for cities: *j'habite à Perth*. For inside a building, use *dans*.",
      en: "*En* is used with many countries, as in *en France*, not with *un appartement*.",
      au: "*Au* is *à* + *le*, as in *au premier étage*. It can't go before *un*.",
    },
  },
  'fr.u3.l3.s6': {
    because: "*Avec* means with: *j'habite avec ma sœur*, I live with my sister.",
    why: {
      in: "'In' is *dans*: *dans la cuisine*.",
      and: "'And' is *et*: *mon frère et ma sœur*.",
      without: "'Without' is *sans*, the opposite of *avec*.",
    },
  },
  'fr.u3.l3.s8': {
    because: "*La cuisine* is the kitchen. It also means cooking, as in *la cuisine française*.",
    why: {
      'the bedroom': "'The bedroom' is *la chambre*, with a 'sh' sound at the start.",
      'the bathroom': "'The bathroom' is *la salle de bains*: after *la*, you'd hear *salle*, with an *s* sound.",
      'the living room': "'The living room' is *le salon*: listen for *le*, not *la*.",
    },
  },
  'fr.u3.l3.s10': {
    because: "The bathroom is *la salle de bains*, literally 'the room of baths'.",
    why: {
      'la chambre': "*La chambre* is the bedroom.",
      'le salon': "*Le salon* is the living room.",
      'la cuisine': "*La cuisine* is the kitchen.",
    },
  },
  'fr.u3.l3.s15': {
    because: "*Cuisine* is feminine, so the adjective adds *-e*: *la cuisine est claire*.",
    why: {
      clair: "*Clair* is masculine, for *le salon est clair*. The kitchen needs *claire*.",
      clairs: "*Clairs* is masculine plural, for several rooms like *les salons*.",
      calmes: "*Calmes* means quiet, and it's plural. You need 'bright' for one room.",
    },
  },
  'fr.u3.l3.s18': {
    because: "One floor up is *le premier étage*, so 'on the first floor' is *au premier étage*.",
    why: {
      'au rez-de-chaussée': "*Au rez-de-chaussée* means on the ground floor, one below the first.",
      'au deuxième étage': "*Deuxième* means second, so this is 'on the second floor'.",
      'à la première chambre': "*Chambre* is a bedroom, so this is 'at the first bedroom', not a floor.",
    },
  },
  'fr.u3.l3.s20': {
    because: "*Au premier étage* is 'on the first floor'. *Premier* means first.",
    why: {
      'I live on the ground floor.': "That would be *j'habite au rez-de-chaussée*, a longer phrase.",
      'I live in a house.': "That would be *j'habite dans une maison*, with no *étage*.",
      'I live on the second floor.': "'Second' is *deuxième*, which starts with a 'duh' sound, not 'pruh'.",
    },
  },
  'fr.u3.l4.s3': {
    because: "*La pharmacie* is the pharmacy. It sounds very close to the English word.",
    why: {
      'the bakery': "'The bakery' is *la boulangerie*, starting with a *b*.",
      'the bank': "'The bank' is *la banque*, short and starting with *b*.",
      'the station': "'The station' is *la gare*, one short syllable.",
    },
  },
  'fr.u3.l4.s5': {
    because: "*La boulangerie* is the bakery, from *le boulanger*, the baker.",
    why: {
      "the butcher's": "The butcher's is *la boucherie*. It starts the same way, so look for *-langerie*.",
      'the bank': "'The bank' is *la banque*.",
      'the supermarket': "'The supermarket' is *le supermarché*.",
    },
  },
  'fr.u3.l4.s7': {
    because: "*Le supermarché* is the supermarket: *super* plus *marché*, market.",
    why: {
      'the market': "'The market' is just *le marché*. Here you hear *super* in front.",
      'the station': "'The station' is *la gare*.",
      'the museum': "'The museum' is *le musée*, which sounds like 'mew-zay'.",
    },
  },
  'fr.u3.l4.s10': {
    because: "The church is *l'église*. It's feminine, *une église*, and *la* becomes *l'* before a vowel.",
    why: {
      "l'école": "*L'école* is the school. Both start with *é*, so read on to the end.",
      'le musée': "*Le musée* is the museum.",
      'la gare': "*La gare* is the station.",
    },
  },
  'fr.u3.l4.s12': {
    because: "*Le parc* is the park and *grand* means big, so it's 'The park is big.'",
    why: {
      'The park is small.': "'Small' is *petit*: *le parc est petit*.",
      'The market is big.': "'The market' is *le marché*, which ends in an 'ay' sound, not a hard *k*.",
      'The museum is big.': "'The museum' is *le musée*, 'mew-zay', quite unlike *parc*.",
    },
  },
  'fr.u3.l4.s15': {
    because: "*Parc* is masculine, and *de* + *le* always joins to make *du*: *près du parc*.",
    why: {
      'de le': "*De* and *le* never sit side by side: they always merge into *du*.",
      'de la': "*De la* is for feminine words: *près de la gare*. *Parc* is masculine.",
      des: "*Des* is *de* + *les*, for plurals: *près des magasins*.",
    },
  },
  'fr.u3.l4.s16': {
    because: "Opposite is *en face de*: *en face de l'église*.",
    why: {
      "à côté de l'église": "*À côté de* means next to.",
      "loin de l'église": "*Loin de* means far from.",
      "près de l'église": "*Près de* means near.",
    },
  },
  'fr.u3.l4.s20': {
    because: "*À côté de* means next to, and *la gare* is the station.",
    why: {
      "It's far from the station.": "'Far from' is *loin de*, which sounds like 'lwan duh'.",
      "It's opposite the station.": "'Opposite' is *en face de*, with a clear 'fass' sound.",
      "It's next to the bank.": "'The bank' is *la banque*. You heard *la gare*, which ends in an *r* sound.",
    },
  },
  'fr.u3.check.s1': {
    because: "*Mon frère* is my brother, and *les yeux bleus* is blue eyes.",
    why: {
      'My father has blue eyes.': "'My father' is *mon père*, starting with a *p* sound, not *fr*.",
      'My brother has brown eyes.': "Brown eyes are *les yeux marron*. You heard *bleus*.",
      'My sister has blue eyes.': "'My sister' is *ma sœur*. Listen for *mon* versus *ma*.",
    },
  },
  'fr.u3.check.s3': {
    because: "For a woman, *gentil* becomes *gentille*: the *l* doubles and you add *-e*.",
    why: {
      gentil: "*Gentil* is masculine: *mon père est très gentil*. Your mother needs *gentille*.",
      gentils: "*Gentils* is the masculine plural, for several people.",
      timides: "*Timides* means shy, and it's plural. The sentence wants 'kind' for one woman.",
    },
  },
  'fr.u3.check.s4': {
    because: "Use *avoir* for having family: *tu as des frères et sœurs ?*",
    why: {
      'Tu es des frères et sœurs ?': "*Tu es* means 'you are', so this asks 'are you brothers and sisters?'",
      'Tu as ta famille ?': "This asks 'do you have your family?', which isn't the question.",
      'Ton frère est comment ?': "This asks 'what's your brother like?'",
    },
  },
  'fr.u3.check.s8': {
    because: "*Au premier étage* is on the first floor, and *près de la gare* is near the station.",
    why: {
      'I live on the ground floor, near the station.': "The ground floor is *le rez-de-chaussée*. You heard *premier étage*.",
      'I live on the first floor, far from the station.': "'Far from' is *loin de*. You heard *près de*, 'preh duh'.",
      'I live on the first floor, opposite the station.': "'Opposite' is *en face de*. You heard *près de*.",
    },
  },
  'fr.u3.check.s9': {
    because: "*Supermarché* is masculine, so *de* + *le* becomes *du*: *loin du supermarché*.",
    why: {
      'de le': "*De le* is never written: it always merges into *du*.",
      'de la': "*De la* is for feminine words, like *loin de la gare*. *Supermarché* is masculine.",
      des: "*Des* is *de* + *les*, for plurals: *loin des supermarchés*.",
    },
  },
}
