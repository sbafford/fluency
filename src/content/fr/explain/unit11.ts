import type { Explanation } from '../../../engine/types'

// Why each answer is right, and each wrong option wrong, for Unit 11's exercises.
export const explain11: Record<string, Explanation> = {
  /* Lesson 1 */
  'fr.u11.l1.s4': {
    because: '*Dans* goes with a field of work: *je travaille dans la communication*, I work in communications.',
    why: {
      pour: '*Pour* goes with the company or person you work for: *je travaille pour une agence*. Communications is a field, so use *dans*.',
      de: '*Travailler de* is not how you say where you work. A field takes *dans*.',
      avec: '*Avec* means with: *je travaille avec Chloé*. It would mean working alongside communications, which makes no sense.',
    },
  },
  'fr.u11.l1.s5': {
    because: '*Pour* + the company: *je travaille pour une banque*, I work for a bank.',
    why: {
      'Je travaille une banque.': '*Travailler* needs a little word before the company. Without *pour*, this is not French.',
      'Je vais à une banque.': '*Je vais à une banque* means I am going to a bank, not that you work for one.',
      "J'ai travaillé pour une banque.": "*J'ai travaillé* is the past: I worked for a bank. The sentence is in the present.",
    },
  },
  'fr.u11.l1.s7': {
    because: "*J'ai une réunion* is I have a meeting, and *à dix heures* is at ten.",
    why: {
      'I have a meeting at two.': 'Two is *deux heures*, or *quatorze heures*. You heard *dix*, ten.',
      'I had a meeting at ten.': "I had would be *j'avais* or *j'ai eu*. You heard *j'ai*, the present.",
      'I have an appointment at ten.': 'An appointment is *un rendez-vous*. *Une réunion* is a meeting with colleagues.',
    },
  },
  'fr.u11.l1.s8': {
    because: '*Le bureau* is the office, and also the desk you work at.',
    why: {
      'the meeting': 'A meeting is *une réunion*.',
      'the boss': 'The boss is *le chef* or *la cheffe*.',
      'the project': 'A project is *un projet*.',
    },
  },
  'fr.u11.l1.s11': {
    because: '*Ma cheffe* is my boss, when the boss is a woman. For a man, *mon chef*.',
    why: {
      'my colleague': 'My colleague is *mon collègue* or *ma collègue*.',
      'my client': 'My client is *mon client* or *ma cliente*.',
      'my office': 'My office is *mon bureau*.',
    },
  },
  'fr.u11.l1.s12': {
    because: '*Je suis en télétravail* is the usual way to say I am working from home.',
    why: {
      bureau: '*Je suis au bureau* means I am at the office, the opposite of working from home. And it takes *au*, not *en*.',
      réunion: '*Je suis en réunion* means I am in a meeting, not working from home.',
      projet: '*En projet* describes a plan not yet carried out, like *une maison en projet*. *Je suis en projet* is not how you say you work from home.',
    },
  },
  'fr.u11.l1.s17': {
    because: '*Qui* is followed straight away by a verb, *fait*, because the colleague is the one doing it.',
    why: {
      que: '*Que* needs a new subject after it, like *le projet que je prépare*. Here the verb comes straight after, so use *qui*.',
      "qu'": "*Qu'* is *que* before a vowel, and *fait* starts with f. It would need a subject anyway.",
      où: '*Où* means where: *le bureau où je travaille*. Here it is a person doing something.',
    },
  },
  'fr.u11.l1.s18': {
    because: '*Que* is followed by a new subject and verb, *je prépare*: the project that I am preparing.',
    why: {
      qui: '*Qui* is followed directly by a verb. Here *je* comes next, so you need *que*.',
      où: '*Où* means where, for a place or time: *le bureau où je travaille*.',
      quoi: '*Quoi* means what, in questions like *tu fais quoi ?*. It does not link a noun to a sentence.',
    },
  },
  /* Lesson 2 */
  'fr.u11.l2.s3': {
    because: '*Je voudrais parler à* is the polite way to ask for someone: I would like to speak to.',
    why: {
      'I spoke to Madame Roux.': "I spoke would be *j'ai parlé*. *Je voudrais* is I would like.",
      "I'm going to speak to Madame Roux.": "That would be *je vais parler à*. *Je voudrais* is a wish, I would like.",
      'Madame Roux would like to speak to me.': 'That would be *Madame Roux voudrait me parler*. The sentence starts with *je*, so I want to speak.',
    },
  },
  'fr.u11.l2.s4': {
    because: '*Parler à* is to speak to: *je voudrais parler à Monsieur Martin*.',
    why: {
      dire: '*Dire* is to say or tell, and needs something to say: *dire bonjour à*.',
      appeler: "*Appeler* takes no *à*: *je voudrais appeler Monsieur Martin*. With *à*, you need *parler*.",
      passer: '*Passer* is what the receptionist does: *je vous le passe*, I will put you through.',
    },
  },
  'fr.u11.l2.s7': {
    because: "*C'est de la part de qui ?* means who is calling? Literally, on behalf of whom?",
    why: {
      'Who is it for?': "Who is it for? is *c'est pour qui ?*. You heard *de la part de*.",
      'Where are you calling from?': "That would be *vous appelez d'où ?*. You heard *qui*, who.",
      'Who do you work for?': 'That would be *vous travaillez pour qui ?*.',
    },
  },
  'fr.u11.l2.s8': {
    because: '*Ne quittez pas* is the fixed phone phrase for hold the line.',
    why: {
      'Ne partez pas.': "*Ne partez pas* means don't leave, for a person in a room. On the phone, it is *ne quittez pas*.",
      'Ne rappelez pas.': "*Ne rappelez pas* means don't call back.",
      'Ne parlez pas.': "*Ne parlez pas* means don't talk.",
    },
  },
  'fr.u11.l2.s12': {
    because: 'Madame Roux is a woman, so it is *la*: *je vous la passe*, I will put you through to her.',
    why: {
      le: '*Le* is for a man: *Monsieur Martin ? Je vous le passe.*',
      les: '*Les* is for several people.',
      lui: "*Lui* means to him or to her. With *passer* the person is *le* or *la*.",
    },
  },
  'fr.u11.l2.s14': {
    because: '*Vous voulez laisser un message ?* means would you like to leave a message?',
    why: {
      'Would you like to send a message?': 'To send is *envoyer*. You heard *laisser*, to leave.',
      'Did you leave a message?': "That would be *vous avez laissé un message ?*. *Vous voulez* is would you like.",
      'Can you call back?': 'That is *vous pouvez rappeler ?*.',
    },
  },
  /* Lesson 3 */
  'fr.u11.l3.s5': {
    because: '*Le rapport* is masculine, so it becomes *le*, before the verb: *je le finis*.',
    why: {
      la: '*La* replaces a feminine word. *Rapport* is masculine.',
      les: '*Les* replaces several things. There is one report.',
      lui: '*Lui* means to him or to her. You finish something, with no *à*, so use *le*.',
    },
  },
  'fr.u11.l3.s6': {
    because: '*La présentation* is feminine, so it becomes *la*: *je la prépare*.',
    why: {
      le: '*Le* replaces a masculine word. *Présentation* is feminine.',
      les: '*Les* is for several things. There is one presentation.',
      leur: '*Leur* means to them, for people. You prepare a thing, so use *la*.',
    },
  },
  'fr.u11.l3.s7': {
    because: '*Les photos* are plural, so they become *les*: *je les envoie*, I am sending them.',
    why: {
      le: "*Le* is for one masculine thing, and it would shorten to *l'* before *envoie*.",
      la: "*La* is for one feminine thing, and it would shorten to *l'* before *envoie*.",
      leur: '*Je leur envoie* means I am sending to them, to people. Here the photos are what you send.',
    },
  },
  'fr.u11.l3.s8': {
    because: "*Je l'appelle* is I am calling him. *L'* stands for Thomas, before the vowel of *appelle*.",
    why: {
      "Thomas? He's calling me tomorrow.": "That would be *il m'appelle demain*. Here *je* is the one calling.",
      "Thomas? I'm calling her tomorrow.": "*L'* can mean her, but it stands for Thomas, a man, so it means him.",
      'Thomas? I called him yesterday.': "That would be *je l'ai appelé hier*. *Je l'appelle demain* is about tomorrow.",
    },
  },
  'fr.u11.l3.s11': {
    because: "With *aller* + a verb, the pronoun goes before the second verb, and *la* becomes *l'* before a vowel.",
    why: {
      'Je vais la appeler.': "*La* must shorten to *l'* before the vowel of *appeler*: *l'appeler*.",
      'Je la vais appeler.': 'The pronoun goes before the verb it belongs to, *appeler*, not before *vais*. *Je la vais appeler* is very old French.',
      'Je vais lui appeler.': "*Appeler* takes no *à*, so the person is *l'*, not *lui*: *je vais l'appeler*.",
    },
  },
  'fr.u11.l3.s16': {
    because: '*Écrire à* quelqu\'un takes *lui* for one person: *je lui écris*, I am writing to her.',
    why: {
      la: '*La* is for something you act on directly. You write *to* someone, so it is *lui*.',
      leur: '*Leur* is to them, for several people. Madame Roux is one person.',
      le: "*Le* is for a masculine thing or man, and you write *to* someone, so it is *lui*.",
    },
  },
  'fr.u11.l3.s17': {
    because: '*Téléphoner à* + several people becomes *leur*: *je leur téléphone*, I am phoning them.',
    why: {
      les: '*Téléphoner* takes *à*, so the people become *leur*, not *les*.',
      lui: '*Lui* is for one person. There are several clients.',
      leurs: '*Leur* meaning to them never takes an s. *Leurs* with s means their, before a plural noun.',
    },
  },
  'fr.u11.l3.s18': {
    because: '*Je lui envoie* is I am sending him. *Lui* stands for Hugo, and *tout de suite* is right away.',
    why: {
      "Hugo? I'm sending them the file right away.": 'Them would be *leur*. You heard *lui*, for one person.',
      "Hugo? He's sending me the file right away.": "That would be *il m'envoie*. You heard *je*, so I am the one sending.",
      "Hugo? I'm sending him the file tomorrow.": 'Tomorrow is *demain*. You heard *tout de suite*, right away.',
    },
  },
  /* Lesson 4 */
  'fr.u11.l4.s4': {
    because: "*Madame, Monsieur,* is the formal opening when you don't know who will read it.",
    why: {
      'Coucou,': '*Coucou* is a very friendly hi, for family and friends.',
      'Salut,': '*Salut* is informal, for friends and close colleagues.',
      'Chère Léa,': '*Chère Léa* is for someone you know by name, and it is personal.',
    },
  },
  'fr.u11.l4.s5': {
    because: '*Je vous écris pour* + a verb says why you are writing: *pour confirmer*, to confirm.',
    why: {
      de: '*Écrire de* does not give a reason. To say why, use *pour*.',
      à: '*À* would make it sound like you are writing to something. The reason takes *pour*.',
      par: '*Par* means by: *par e-mail*. The reason takes *pour*.',
    },
  },
  'fr.u11.l4.s8': {
    because: '*Ci-joint* means attached, so *vous trouverez ci-joint le programme* is please find the programme attached.',
    why: {
      'Please find the programme below.': 'Below is *ci-dessous*. You heard *ci-joint*, attached.',
      'You can find the programme online.': 'Online is *en ligne*. *Ci-joint* means attached to the e-mail.',
      'Could you send me the programme?': "That would be *pourriez-vous m'envoyer le programme ?*. Here the programme is already attached.",
    },
  },
  'fr.u11.l4.s9': {
    because: '*La pièce jointe* is the attachment, the file that comes with the e-mail.',
    why: {
      réunion: "*La réunion* is the meeting. A meeting can't open or fail to open.",
      signature: '*La signature* is the signature at the bottom. The translation is about an attachment.',
      journée: "*La journée* is the day. A day doesn't open like a file.",
    },
  },
  'fr.u11.l4.s12': {
    because: '*Pourriez-vous* + a verb is the polite way to ask: could you send me the file?',
    why: {
      "Vous m'avez envoyé le dossier ?": 'This is the past: did you send me the file?',
      "Vous allez m'envoyer le dossier ?": 'This asks are you going to send me the file? It is less polite than *pourriez-vous*.',
      'Je vous envoie le dossier ?': 'This is shall I send you the file? The wrong way round.',
    },
  },
  'fr.u11.l4.s15': {
    because: '*Merci et bonne journée* is warm but still polite enough for a work e-mail.',
    why: {
      'Bisous et à plus !': '*Bisous* is love, kisses, for friends and family only.',
      'Allez, salut !': '*Salut* is too casual for most work e-mails.',
      'Coucou, à demain !': '*Coucou* is a very friendly hi, and it opens a message rather than ending it.',
    },
  },
  'fr.u11.l4.s18': {
    because: '*Cordialement* is the standard work sign-off: kind regards.',
    why: {
      'Lots of love, Sarah Wilson': 'Lots of love is *grosses bises* or *bisous*, never for work.',
      'Yours, Sarah Wilson (to a friend)': "*Cordialement* is for work, not friends. To a friend you'd write *bises* or *à bientôt*.",
      'Thanks again, Sarah Wilson': 'Thanks again is *merci encore*. *Cordialement* has no thanks in it.',
    },
  },
  /* Checkpoint */
  'fr.u11.check.s1': {
    because: '*Elle est en réunion* is she is in a meeting, and *vous pouvez rappeler ?* is can you call back?',
    why: {
      'Madame Roux is on holiday. Can you call back?': 'On holiday is *en vacances*. You heard *en réunion*.',
      "Madame Roux is in a meeting. She'll call you back.": "That would be *elle vous rappelle*. You heard *vous pouvez rappeler ?*, so you call back.",
      'Madame Roux is busy. Can you leave a message?': 'You heard *en réunion*, in a meeting, and *rappeler*, call back. Nothing about a message.',
    },
  },
  'fr.u11.check.s2': {
    because: '*Qui* is followed straight away by the verb *parle*: the colleague who speaks Japanese.',
    why: {
      que: '*Que* needs a new subject after it. Here the verb comes next, so use *qui*.',
      où: '*Où* means where. Here it is a person doing something.',
      "qu'": "*Qu'* is *que* before a vowel. *Parle* starts with p, and it needs *qui* anyway.",
    },
  },
  'fr.u11.check.s3': {
    because: '*Le dossier* is masculine, so it becomes *le* before the verb: *je le lis*.',
    why: {
      la: '*La* replaces a feminine word. *Dossier* is masculine.',
      les: '*Les* replaces several things. There is one file.',
      lui: '*Lui* means to him or her. You read something directly, so it is *le*.',
    },
  },
  'fr.u11.check.s5': {
    because: '*Pourriez-vous rappeler ?* is could you call back? and *demain* is tomorrow.',
    why: {
      'Can I call back tomorrow?': 'That would be *je peux rappeler demain ?*. *Pourriez-vous* asks you.',
      'Did you call back yesterday?': 'That would be *vous avez rappelé hier ?*. *Demain* is tomorrow.',
      'Will you be in tomorrow?': 'That would be *vous serez là demain ?*. *Rappeler* means to call back.',
    },
  },
  'fr.u11.check.s6': {
    because: '*Écrire à* several people becomes *leur*: *je leur écris*, I am writing to them.',
    why: {
      les: '*Écrire* takes *à* before the person, so the clients become *leur*.',
      lui: '*Lui* is for one person. There are several clients.',
      leurs: '*Leur* meaning to them never takes an s.',
    },
  },
  'fr.u11.check.s9': {
    because: '*Vous trouverez ci-joint* means please find attached.',
    why: {
      'The meeting programme is below.': 'Below is *ci-dessous*. *Ci-joint* means attached.',
      'The meeting has been cancelled.': 'Cancelled is *annulée*. The sentence is about an attachment.',
      'Please send me the meeting programme.': 'That would be *merci de m\'envoyer le programme*. Here you are the one sending it.',
    },
  },
  'fr.u11.check.s11': {
    because: 'After *pour*, the verb stays in the infinitive: *pour confirmer*.',
    why: {
      confirmé: '*Confirmé* is the past participle, as in *j\'ai confirmé*. After *pour*, use the infinitive.',
      confirme: '*Confirme* goes with *je* or *il*. After *pour*, use the infinitive.',
      confirmez: '*Confirmez* goes with *vous*. After *pour*, use the infinitive.',
    },
  },
}
