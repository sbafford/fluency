import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 4's exercises.
export const explain4: Record<string, Explanation> = {
  'fr.u4.l1.s3': {
    because: "*J'adore* is 'I love', stronger than *j'aime*. It's very common for food and activities.",
    why: {
      'I hate cheese.': "'I hate' is *je déteste*: *je déteste le fromage*.",
      'I prefer cheese.': "'I prefer' is *je préfère*: *je préfère le fromage*.",
      'I like coffee.': "That would be *j'aime le café*. Here the verb is *adore* and the food is *fromage*.",
    },
  },
  'fr.u4.l1.s6': {
    because: "After *aimer*, French keeps the article: *j'aime le fromage*. *Fromage* is masculine, so *le*.",
    why: {
      la: "*La* is for feminine words, like *j'aime la musique*. *Fromage* is masculine.",
      du: "*Du* means 'some': *je voudrais du fromage*. Likes are about cheese in general, so *le*.",
      une: "*Fromage* is masculine, so it can't take *une*. To like cheese in general, French uses *le*.",
    },
  },
  'fr.u4.l1.s8': {
    because: "*Tu aimes* asks 'do you like', and *cuisiner* means to cook.",
    why: {
      'Do you like reading?': "'Reading' would be *lire*: *tu aimes lire ?*",
      'I like cooking.': "That would start with *j'aime*. Here you hear *tu*, and the voice rises as a question.",
      'Do you like travelling?': "'Travelling' would be *voyager*, with a 'vwa' sound at the start.",
    },
  },
  'fr.u4.l1.s14': {
    because: "*Ne* and *pas* go either side of the verb: *je n'aime pas*.",
    why: {
      ne: "*Ne* is already there as *n'*. The second half, after the verb, is *pas*.",
      non: "*Non* means 'no' on its own. Inside a sentence, the negative is *ne ... pas*.",
      si: "*Si* means if, or yes after a negative question. The *ne* needs *pas* to make 'not'.",
    },
  },
  'fr.u4.l1.s16': {
    because: "To agree with something negative, say *moi non plus*: me neither.",
    why: {
      aussi: "*Moi aussi* agrees with something positive, like *j'aime le café*. After a negative, use *moi non plus*.",
      pas: "*Moi pas plus* isn't French. The fixed phrase is *moi non plus*.",
      ne: "*Ne* needs a verb after it. 'Me neither' is simply *moi non plus*.",
    },
  },
  'fr.u4.l1.s17': {
    because: "*Moi aussi !* agrees with something positive, like *j'aime lire*.",
    why: {
      'Moi non plus !': "*Moi non plus* means 'me neither', for agreeing with a negative.",
      'Pas du tout !': "*Pas du tout* means 'not at all'.",
      'Moi, je déteste !': "This means 'Me, I hate it!', the opposite of agreeing.",
    },
  },
  'fr.u4.l1.s19': {
    because: "*Je préfère* is 'I prefer', and *lire* is to read.",
    why: {
      'I like reading.': "'I like' is *j'aime*: *j'aime lire*. You heard *préfère*.",
      'I prefer travelling.': "'Travelling' is *voyager*. Here the last word is the short *lire*.",
      'I hate reading.': "'I hate' is *je déteste*, with a clear 't' sound: *je déteste lire*.",
    },
  },
  'fr.u4.l2.s3': {
    because: "*Des fraises* is strawberries. It sounds like 'day frez'.",
    why: {
      apples: "Apples are *des pommes*, which sounds like 'day pom'.",
      tomatoes: "Tomatoes are *des tomates*, much like the English word.",
      cheese: "Cheese is *du fromage*: you'd hear *du*, not *des*.",
    },
  },
  'fr.u4.l2.s4': {
    because: "*Du* means 'some' with masculine words, and *fromage* is cheese.",
    why: {
      'some bread': "'Some bread' is *du pain*.",
      'some apples': "'Some apples' is *des pommes*, with *des* for plurals.",
      'some wine': "'Some wine' is *du vin*.",
    },
  },
  'fr.u4.l2.s7': {
    because: "*Pommes* is plural, so 'some' is *des*: *des pommes*.",
    why: {
      du: "*Du* is for one masculine thing: *du fromage*. With a plural, use *des*.",
      'de la': "*De la* is for feminine things you can't count, like *de la confiture*.",
      le: "*Le* means 'the' and is singular. 'Some apples' needs *des*.",
    },
  },
  'fr.u4.l2.s8': {
    because: "After a negative, *du*, *de la* and *des* all become *de*: *je ne veux pas de fromage*.",
    why: {
      du: "*Du* is right in the question, but after *ne ... pas* it shrinks to *de*.",
      des: "*Des* is for plurals, and after a negative it also becomes *de*.",
      la: "*Fromage* is masculine, so never *la*. And after *pas*, 'any' is just *de*.",
    },
  },
  'fr.u4.l2.s13': {
    because: "*Cinq cents grammes* is 500 g, and *de fraises* is 'of strawberries'.",
    why: {
      '5 kg of strawberries, please.': "5 kg would be *cinq kilos*. You heard *cents grammes*.",
      '500 g of tomatoes, please.': "Tomatoes are *tomates*. You heard *fraises*, 'frez'.",
      '50 g of strawberries, please.': "50 is *cinquante*, 'san-kont'. You heard *cinq cents*, 'sank son'.",
    },
  },
  'fr.u4.l2.s14': {
    because: "After a quantity, use just *de*: *un morceau de fromage*.",
    why: {
      'un morceau du fromage': "After a quantity like *un morceau*, use plain *de*, not *du*.",
      'une bouteille de fromage': "*Une bouteille* is a bottle, which doesn't suit cheese.",
      'un kilo des fromages': "*Un kilo* is a kilo, not a piece, and quantities take *de*, never *des*.",
    },
  },
  'fr.u4.l2.s16': {
    because: "*C'est tout* is the fixed phrase for 'that's all'. *Tout* stays the same here.",
    why: {
      tous: "*Tous* is the plural form, as in *tous les jours*. *C'est tout* never changes.",
      toute: "*Toute* is the feminine form, as in *toute la journée*. Here it's always *tout*.",
      rien: "*Rien* means 'nothing'. People say *non, c'est tout*, or *rien d'autre*.",
    },
  },
  'fr.u4.l2.s19': {
    because: "*Trois euros le kilo* means three euros a kilo. French uses *le* where English says 'a'.",
    why: {
      'Three kilos for a euro.': "That would be *trois kilos pour un euro*, with the numbers swapped.",
      'Thirteen euros a kilo.': "Thirteen is *treize*, 'trez'. You heard *trois*, 'trwa'.",
      'Three euros a bottle.': "That would be *trois euros la bouteille*. You heard *le kilo*.",
    },
  },
  'fr.u4.l3.s3': {
    because: "*Un pull* is a jumper, short for the English 'pullover'.",
    why: {
      'a shirt': "'A shirt' is *une chemise*.",
      'a dress': "'A dress' is *une robe*.",
      trousers: "'Trousers' is *un pantalon*, singular in French.",
    },
  },
  'fr.u4.l3.s4': {
    because: "*Des chaussures* is shoes. Listen for 'show-sewr'.",
    why: {
      'a shirt': "'A shirt' is *une chemise*: you'd hear *une*, not *des*.",
      socks: "Socks are *des chaussettes*. Same start, but it ends in a 'set' sound.",
      trousers: "'Trousers' is *un pantalon*, starting with *un*.",
    },
  },
  'fr.u4.l3.s9': {
    because: "*Robe* is feminine, so the colour adds *-e*: *une robe noire*.",
    why: {
      noir: "*Noir* is the masculine form: *un pull noir*. A dress needs *noire*.",
      noires: "*Noires* is feminine plural, for several dresses: *des robes noires*.",
      noirs: "*Noirs* is masculine plural: *des pulls noirs*.",
    },
  },
  'fr.u4.l3.s10': {
    because: "*Chemise* is feminine, *blanc* becomes *blanche*, and the colour comes after the noun.",
    why: {
      'une chemise blanc': "*Blanc* is masculine. With *chemise* it changes to *blanche*.",
      'une blanche chemise': "Colours come after the noun in French: *une chemise blanche*.",
      'un chemise blanc': "*Chemise* is feminine, so it takes *une* and *blanche*.",
    },
  },
  'fr.u4.l3.s12': {
    because: "*Des chaussures* is shoes and *rouges* is red, after the noun as usual.",
    why: {
      'A red dress.': "That would be *une robe rouge*, starting with *une*.",
      'Black shoes.': "Black is *noires* here, 'nwar'. You heard *rouges*, 'roozh'.",
      'Red trousers.': "That would be *un pantalon rouge*.",
    },
  },
  'fr.u4.l3.s16': {
    because: "To ask for another colour or size, say *vous l'avez en*: *vous l'avez en noir ?*",
    why: {
      au: "*Au* means 'at the' or 'to the', as in *au marché*. Colours take *en*.",
      de: "*De* means 'of'. For 'in black', French uses *en*.",
      à: "*À* is for places, like *à Paris*. With a colour, use *en*.",
    },
  },
  'fr.u4.l3.s17': {
    because: "*Je peux essayer ?* is 'can I try it on?'. No word for 'it' is needed.",
    why: {
      'Je cherche la taille.': "This says 'I'm looking for the size', not asking to try it on.",
      "Vous l'avez en bleu ?": "This asks 'do you have it in blue?'",
      'Je peux vous aider ?': "This is what staff say: 'can I help you?'",
    },
  },
  'fr.u4.l3.s19': {
    because: "*Quelle taille* means 'what size', so *vous faites quelle taille ?* asks your clothes size.",
    why: {
      'What colour is it?': "That would use *couleur*: *c'est quelle couleur ?*",
      'Can I help you?': "That would be *je peux vous aider ?*",
      'How much is it?': "That would be *c'est combien ?* or *ça coûte combien ?*",
    },
  },
  'fr.u4.l4.s4': {
    because: "*Douze* is 12 and *cinquante* is 50, so it's €12.50. Euros come first, then the cents.",
    why: {
      '€2.50': "€2.50 is *deux euros cinquante*. *Douze* has a 'z' sound: 'dooz'.",
      '€12.15': "€12.15 is *douze euros quinze*. You heard *cinquante*, 'san-kont'.",
      '€20.50': "€20.50 is *vingt euros cinquante*, starting with 'van'.",
    },
  },
  'fr.u4.l4.s5': {
    because: "*Quarante-neuf* is 49 and *quatre-vingt-dix* (four twenties plus ten) is 90.",
    why: {
      '€49.19': "€49.19 ends in *dix-neuf*. You heard *quatre-vingt-dix*, which is 90.",
      '€59.90': "59 is *cinquante-neuf*. You heard *quarante*, 40.",
      '€40.90': "€40.90 is *quarante euros quatre-vingt-dix*, without *neuf* after *quarante*.",
    },
  },
  'fr.u4.l4.s8': {
    because: "*Je peux payer* is 'can I pay', and 'by card' is *par carte*.",
    why: {
      'Je peux payer en espèces ?': "*En espèces* means in cash, not by card.",
      'Vous payez par carte ?': "This asks someone else: 'are you paying by card?'",
      'Je paie en carte.': "Card takes *par*: *je paie par carte*. And this is a statement, not a question.",
    },
  },
  'fr.u4.l4.s9': {
    because: "Cash takes *en*: *je paie en espèces*. A card takes *par*.",
    why: {
      par: "*Par* goes with card: *par carte*. With *espèces*, it's *en*.",
      avec: "*Avec* means with. The fixed phrase for cash is *en espèces*.",
      à: "*À* is mostly for places and times. Cash is always *en espèces*.",
    },
  },
  'fr.u4.l4.s12': {
    because: "*Tapez votre code* means 'enter your PIN', which you'll hear at the till.",
    why: {
      'Your receipt, please.': "The receipt is *le ticket*: *votre ticket*. You heard *code*.",
      'Pay by card, please.': "That would be *payez par carte*. You heard *tapez*, not *payez*.",
      'Keep the change.': "That's *gardez la monnaie*.",
    },
  },
  'fr.u4.l4.s13': {
    because: "*Le ticket* is the receipt in shops, so this asks if you'd like it.",
    why: {
      'Would you like the change?': "The change is *la monnaie*.",
      'Would you like a bag?': "A bag is *un sac*: *vous voulez un sac ?*",
      'Would you like to pay?': "That would use the verb: *vous voulez payer ?*",
    },
  },
  'fr.u4.l4.s15': {
    because: "*La monnaie* is your change, so *gardez la monnaie* is 'keep the change'.",
    why: {
      code: "*Le code* is your PIN. It's masculine, so it can't follow *la*.",
      ticket: "*Le ticket* is the receipt, and it takes *le*, not *la*.",
      carte: "*La carte* is your card. You'd hardly tell someone to keep it!",
    },
  },
  'fr.u4.l4.s17': {
    because: "*Trop* means too, and *cher* means expensive.",
    why: {
      "It's very cheap.": "'Very cheap' would be *très bon marché*, or *pas cher du tout*.",
      "It's on sale.": "'On sale' is *en solde*: *c'est en solde*.",
      "It's too big.": "'Too big' is *trop grand*. *Trop* matches, but *cher* is about price.",
    },
  },
  'fr.u4.check.s1': {
    because: "*Ne ... pas du tout* is 'not at all', and *le fromage* is cheese.",
    why: {
      'I really like cheese.': "That would be *j'aime beaucoup le fromage*, with no *ne ... pas*.",
      "I don't like bread at all.": "Bread is *le pain*. You heard *fromage*.",
      'I like all cheese.': "*Du tout* here means 'at all', not 'all'. The *n'... pas* makes it negative.",
    },
  },
  'fr.u4.check.s2': {
    because: "Like *aimer*, *préférer* keeps the article: *je préfère le thé*.",
    why: {
      du: "*Du* means 'some', for buying or having: *je voudrais du thé*. Preferences take *le*.",
      de: "*De* alone follows a negative or quantity, like *une tasse de thé*.",
      une: "*Thé* is masculine, so never *une*. For tea in general, use *le thé*.",
    },
  },
  'fr.u4.check.s5': {
    because: "After a negative, *des* becomes *de*: *je n'ai pas de fraises*.",
    why: {
      des: "*Des* is right in the question, but after *ne ... pas* it becomes *de*.",
      la: "*La* is singular and feminine, but *fraises* is plural. After *pas*, 'any' is simply *de*.",
      du: "*Du* is for one masculine thing, and it also becomes *de* after a negative.",
    },
  },
  'fr.u4.check.s6': {
    because: "*Pommes* is plural, so the verb is *coûtent*: *combien coûtent les pommes ?*",
    why: {
      'Combien coûte les pommes ?': "*Coûte* is for one thing: *combien coûte le pain ?* With *les pommes*, use *coûtent*.",
      'Combien de pommes ?': "This asks 'how many apples?', not how much they cost.",
      'Les pommes, ça va ?': "This asks 'the apples, are they OK?'",
    },
  },
  'fr.u4.check.s8': {
    because: "*Vous l'avez en bleu ?* is 'do you have it in blue?'",
    why: {
      'Do you have it in black?': "Black is *noir*, 'nwar'. You heard *bleu*.",
      'Is it blue?': "That would be *c'est bleu ?* or *il est bleu ?*, with no *avez*.",
      'Do you have a blue one in a 38?': "There's no number here. *En 38* would ask for a size.",
    },
  },
  'fr.u4.check.s10': {
    because: "*Vingt-sept* is 27 and *quatre-vingt-dix* is 90, so it's €27.90.",
    why: {
      '€27.19': "19 is *dix-neuf*. You heard *quatre-vingt-dix*, which is 90.",
      '€37.90': "37 is *trente-sept*. You heard *vingt-sept*, 'vant-set'.",
      '€20.79': "That's *vingt euros soixante-dix-neuf*. Here *sept* comes before *euros*.",
    },
  },
}
