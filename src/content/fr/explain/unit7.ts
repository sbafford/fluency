import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 7's exercises.
export const explain7: Record<string, Explanation> = {
  /* Lesson 1 */
  'fr.u7.l1.s3': {
    because: "*Tu as fait* is the past of *tu fais*, so the question is about something already done: what did you do?",
    why: {
      'What are you doing?': "What are you doing? is *qu'est-ce que tu fais ?*, with no *as*.",
      'What are you going to do?': "What are you going to do? is *qu'est-ce que tu vas faire ?*, with *vas* and the infinitive.",
      'What do you do for a living?': "That is *qu'est-ce que tu fais dans la vie ?*. *Tu as fait* is about the past.",
    },
  },
  'fr.u7.l1.s6': {
    because: "The past is *avoir* + the participle: *j'ai mangé*, I ate.",
    why: {
      'Je mange.': '*Je mange* is the present: I eat, or I am eating.',
      'Je vais manger.': '*Je vais manger* is the near future: I am going to eat.',
      'Tu as mangé.': '*Tu as mangé* is you ate. For I, use *j\'ai*.',
    },
  },
  'fr.u7.l1.s7': {
    because: "*Travailler* takes *avoir* in the past, and with *je* that is *j'ai*: *j'ai travaillé*.",
    why: {
      'tu as': '*Tu as travaillé* means you worked. The sentence says I.',
      'je suis': '*Travailler* uses *avoir*, not *être*, in the past.',
      "j'a": "*A* goes with *il*, *elle* and *on*. With *je*, it is *j'ai*.",
    },
  },
  'fr.u7.l1.s11': {
    because: "*J'ai parlé* is the past: I talked. *Avec Hugo* is with Hugo.",
    why: {
      'I talk with Hugo.': "I talk is the present, *je parle*. You heard *j'ai parlé*.",
      "I'm going to talk with Hugo.": "That would be *je vais parler*. You heard *j'ai*, which points to the past.",
      'Hugo talked with me.': "That would be *Hugo a parlé avec moi*. The sentence starts with *j'ai*, so I did the talking.",
    },
  },
  'fr.u7.l1.s12': {
    because: 'After *tu as*, you need the past participle: *écouté*, ending in *é*.',
    why: {
      écouter: '*Écouter* is the infinitive. It sounds the same, but after *as* you write *écouté*.',
      écoute: '*Écoute* is the present with *je* or *il*. After *tu as*, write *écouté*.',
      écoutes: '*Écoutes* is the present with *tu*: *tu écoutes*. With *tu as*, write *écouté*.',
    },
  },
  'fr.u7.l1.s14': {
    because: '*Hier* is yesterday and *soir* is evening, so *hier soir* is last night.',
    why: {
      'this evening': 'This evening is *ce soir*.',
      'yesterday morning': 'Yesterday morning is *hier matin*.',
      'tomorrow evening': 'Tomorrow evening is *demain soir*.',
    },
  },

  /* Lesson 2 */
  'fr.u7.l2.s3': {
    because: "*Vu* is the past participle of *voir*, so *j'ai vu Léa* is I saw Léa.",
    why: {
      'I see Léa.': 'I see is the present, *je vois*.',
      'I drank with Léa.': "I drank is *j'ai bu*, with a b. *Vu* starts with a v.",
      "I'm going to see Léa.": "That is *je vais voir Léa*. *J'ai vu* is the past.",
    },
  },
  'fr.u7.l2.s5': {
    because: "The past participle of *prendre* is *pris*: *j'ai pris le bus*.",
    why: {
      "J'ai prendu le bus.": '*Prendu* is not a French word. *Prendre* is irregular: *pris*.',
      'Je prends le bus.': '*Je prends* is the present: I take, or I am taking.',
      "J'ai mis le bus.": "*Mis* is from *mettre*, to put. *J'ai mis le bus* would mean I put the bus.",
    },
  },
  'fr.u7.l2.s8': {
    because: "The past participle of *boire* is *bu*: *j'ai bu un café*.",
    why: {
      bois: '*Bois* is the present: *je bois*. After *j\'ai*, use the participle *bu*.',
      boire: '*Boire* is the infinitive. After *j\'ai*, use *bu*.',
      vu: "*Vu* is from *voir*. *J'ai vu un café* means I saw a coffee.",
    },
  },
  'fr.u7.l2.s9': {
    because: "*Lu* is the past participle of *lire*, to read: *j'ai lu un livre*.",
    why: {
      'I bought a book.': "I bought is *j'ai acheté*.",
      'I wrote a book.': "I wrote is *j'ai écrit*.",
      "I'm reading a book.": "That is *je lis un livre*. You heard *j'ai lu*, the past.",
    },
  },
  'fr.u7.l2.s12': {
    because: "*Écrit* is the past participle of *écrire*, to write: *j'ai écrit*, I wrote.",
    why: {
      'I read a message.': "I read is *j'ai lu*.",
      'I write a message.': "I write is the present, *j'écris*. *J'ai écrit* is the past.",
      'I sent a message.': "I sent is *j'ai envoyé*.",
    },
  },
  'fr.u7.l2.s13': {
    because: "The past participle of *dire* is *dit*: *j'ai dit merci*.",
    why: {
      dis: '*Dis* is the present: *je dis*. After *j\'ai*, write *dit*, with a silent t.',
      fait: "*J'ai fait merci* doesn't work. *Fait* means did or made.",
      été: "*Été* is from *être*. *J'ai été merci* means nothing.",
    },
  },
  'fr.u7.l2.s18': {
    because: "*Mettre* also means to put on clothes, and its past participle is *mis*: *j'ai mis un pull*.",
    why: {
      met: '*Met* is the present with *il* or *elle*: *il met*. After *j\'ai*, use *mis*.',
      mettre: '*Mettre* is the infinitive. After *j\'ai*, use *mis*.',
      pris: "*J'ai pris un pull* means I took a jumper, not I put one on.",
    },
  },

  /* Lesson 3 */
  'fr.u7.l3.s3': {
    because: "*Ne* and *pas* around *ai* make it negative: *je n'ai pas vu*, I didn't see.",
    why: {
      'I saw Hugo.': "I saw Hugo is *j'ai vu Hugo*. You heard *n'ai pas*, so it is negative.",
      "I don't see Hugo.": "That is the present, *je ne vois pas Hugo*. *N'ai pas vu* is the past.",
      "Hugo didn't see me.": "Then *Hugo* would be the subject, at the start. The sentence starts with *je*, so I didn't see him.",
    },
  },
  'fr.u7.l3.s6': {
    because: "*Ne* shortens to *n'* before *ai*, and *pas* follows: *je n'ai pas eu le temps*.",
    why: {
      ne: '*Ne* needs *avoir* after it: *je n\'ai pas*. Without *ai*, there is no verb.',
      ai: "*Je ai* is never written: it becomes *j'ai*. And in careful French, a negative also needs *ne*: *je n'ai pas*.",
      "n'as": "*As* goes with *tu*: *tu n'as pas*. With *je*, it is *n'ai*.",
    },
  },
  'fr.u7.l3.s9': {
    because: '*Pas encore* means not yet: *je n\'ai pas encore fini*.',
    why: {
      déjà: '*Déjà* means already, the opposite of not yet.',
      jamais: '*Jamais* means never.',
      'pas du tout': '*Pas du tout* means not at all.',
    },
  },
  'fr.u7.l3.s10': {
    because: "*Déjà* means already, and it sits between *as* and the participle: *tu as déjà mangé ?*",
    why: {
      demain: '*Demain* means tomorrow, which clashes with a past tense.',
      encore: "*Tu as encore mangé ?* means did you eat again?",
      'hier soir': '*Hier soir* goes at the end or the start: *tu as mangé hier soir ?*. It means last night, not already.',
    },
  },
  'fr.u7.l3.s11': {
    because: "*Jamais* replaces *pas*, and after a negative *des* becomes *d'*: *je n'ai jamais mangé d'escargots*.",
    why: {
      "Je n'ai jamais mangé des escargots.": "After a negative, *des* becomes *de*, or *d'* before a vowel: *d'escargots*.",
      "Je n'ai pas encore mangé d'escargots.": "That means I haven't eaten snails yet. Never is *jamais*.",
      "Je ne jamais ai mangé d'escargots.": "*Ne* and *jamais* go around *ai*: *je n'ai jamais*.",
    },
  },
  'fr.u7.l3.s15': {
    because: '*Il y a* + a length of time means ago: *il y a deux jours*, two days ago.',
    why: {
      'I saw Léa for two days.': 'For two days is *pendant deux jours*.',
      "I'll see Léa in two days.": "That is *je vais voir Léa dans deux jours*. *J'ai vu* is the past.",
      'Léa saw me two days ago.': "Then *Léa* would be the subject, at the start. The sentence starts with *j'ai*, so I saw her.",
    },
  },
  'fr.u7.l3.s16': {
    because: '*Semaine* is feminine, so *dernier* takes an e: *la semaine dernière*.',
    why: {
      dernier: '*Dernier* is the masculine form: *le week-end dernier*. *Semaine* is feminine.',
      prochaine: "*La semaine prochaine* is next week, which doesn't fit *j'ai travaillé*.",
      passé: "You may hear *la semaine passée*, with an extra e to agree with *semaine*. *Passé* without it is wrong here, and *dernière* is the everyday word.",
    },
  },

  /* Lesson 4 */
  'fr.u7.l4.s3': {
    because: '*Après* means afterwards, and *on a pris* is the past: we had.',
    why: {
      'Before that, we had a coffee.': 'Before that is *avant*.',
      "Afterwards, we're having a coffee.": "That would be *on prend un café*. *On a pris* is the past.",
      'First, we had a coffee.': "First is *d'abord*.",
    },
  },
  'fr.u7.l4.s7': {
    because: 'For a length of time in the past, French uses *pendant*: *pendant dix heures*.',
    why: {
      pour: "English says for, but in the past French uses *pendant*. *Pour* is for plans: *pour une semaine*.",
      'il y a': "*Il y a dix heures* means ten hours ago, so it changes the meaning.",
      depuis: '*Depuis* is for something still going on now. Sleep that is over takes *pendant*.',
    },
  },
  'fr.u7.l4.s8': {
    because: '*Raconte !* comes from *raconter*, to tell a story: tell me!',
    why: {
      'Count!': 'Count! is *compte !*, from *compter*.',
      'Listen!': 'Listen! is *écoute !*.',
      'Come back!': 'Come back! is *reviens !*.',
    },
  },
  'fr.u7.l4.s11': {
    because: "*C'était nul* means it was rubbish.",
    why: {
      'The film? It was brilliant!': "It was brilliant is *c'était génial*.",
      "The film? It's rubbish!": "That would be *c'est nul*. *C'était* is the past.",
      'The film? It was long!': "It was long is *c'était long*.",
    },
  },
  'fr.u7.l4.s12': {
    because: "For food, *c'était bon* means it was tasty.",
    why: {
      "C'est bon.": "*C'est bon* is the present: it is tasty.",
      "C'était beau.": "*Beau* means beautiful, for a view or a place, not for taste.",
      "C'était nul.": "*C'était nul* means it was rubbish.",
    },
  },
  'fr.u7.l4.s13': {
    because: "After *c'était*, the adjective stays in its basic form: *c'était génial*.",
    why: {
      géniale: "Even for *la fête*, *c'était* takes the basic form: *génial*, not *géniale*.",
      nul: "*Nul* means rubbish, which doesn't fit dancing all night.",
      fatigué: "*Fatigué* describes a person: *j'étais fatigué*. And it doesn't say how the party was.",
    },
  },

  /* Checkpoint */
  'fr.u7.check.s1': {
    because: "*Hier soir* is last night, and *j'ai regardé* is I watched.",
    why: {
      "Tonight, I'm watching a film with Hugo.": "Tonight is *ce soir*, and I'm watching is *je regarde*.",
      'Last night, Hugo watched a film.': "That would be *Hugo a regardé*. The sentence starts with *j'ai*.",
      'Yesterday morning, I watched a film with Hugo.': 'Yesterday morning is *hier matin*. You heard *soir*.',
    },
  },
  'fr.u7.check.s3': {
    because: "The past participle of *prendre* is *pris*: *j'ai pris le train*.",
    why: {
      prendu: '*Prendu* is not a French word. The participle is *pris*.',
      prends: '*Prends* is the present: *je prends*. After *j\'ai*, use *pris*.',
      mis: '*Mis* is from *mettre*, to put.',
    },
  },
  'fr.u7.check.s4': {
    because: "*Bu* is the past participle of *boire*: *j'ai bu*, I drank.",
    why: {
      'I saw a coffee.': "I saw is *j'ai vu*, with a v.",
      "I'm having a coffee.": "That is *je prends un café*. *J'ai bu* is the past.",
      'I want a coffee.': 'I want is *je veux*.',
    },
  },
  'fr.u7.check.s5': {
    because: "*Ne* and *pas* go around *ai*: *je n'ai pas vu*.",
    why: {
      ne: "*Ne* is already there as *n'*. The second part, *pas*, is missing.",
      non: '*Non* means no as an answer. Inside a sentence, use *ne… pas*.',
      déjà: "*Déjà* can't replace *pas*: *je n'ai déjà vu* is not French. The negative needs *pas*.",
    },
  },
  'fr.u7.check.s8': {
    because: "*Jamais* means never: *je n'ai jamais vu la neige*, I've never seen snow.",
    why: {
      "I haven't seen snow yet.": "Not yet is *pas encore*: *je n'ai pas encore vu la neige*.",
      'I saw snow last year.': "That would be *j'ai vu la neige l'année dernière*, with no negative.",
      "I've already seen snow.": "Already is *déjà*: *j'ai déjà vu la neige*.",
    },
  },
  'fr.u7.check.s10': {
    because: "*C'était nul* is it was rubbish, and *parce que j'ai eu un problème* is because I had a problem.",
    why: {
      "It was great because I didn't have a problem.": "Great would be *génial*, and there is no *pas* in the sentence.",
      'It was rubbish because I have a problem.': "I have is *j'ai*. *J'ai eu* is the past: I had.",
      'It was nice, but I had a problem.': "Nice is *sympa*, and but is *mais*. You heard *nul* and *parce que*.",
    },
  },
}
