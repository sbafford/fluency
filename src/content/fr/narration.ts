import type { Narration } from '../../engine/types'

/*
 * Recorded voices for French. The voice names are Google Cloud Text-to-Speech
 * Chirp 3 HD voices; change them here and re-run `npm run audio` to re-record.
 * Roles: f1 is the main narrator and Sarah; f2 and f3 are other women; m1 is
 * Hugo; m2 is other men. Each character keeps one voice everywhere.
 */

export const narration: Narration = {
  voices: {
    f1: 'fr-FR-Chirp3-HD-Aoede',
    f2: 'fr-FR-Chirp3-HD-Leda',
    f3: 'fr-FR-Chirp3-HD-Kore',
    m1: 'fr-FR-Chirp3-HD-Charon',
    m2: 'fr-FR-Chirp3-HD-Puck',
  },
  // Pronunciation fixes, by the line as shown in the app. Short fragments are
  // already sent as sentences ("tu es" is read from "Tu es."); add a line here
  // only if it still sounds wrong after that, then run npm run audio again.
  spoken: {},
  narrator: 'f1',
  second: 'm2',
  speakers: {
    Sarah: 'f1',
    'Léa': 'f2',
    'Inès': 'f2',
    Nathalie: 'f2',
    Anna: 'f2',
    Emma: 'f2',
    Julie: 'f3',
    Camille: 'f3',
    'Claire Dubois': 'f3',
    'Madame Roux': 'f3',
    'La marchande': 'f3',
    'La vendeuse': 'f3',
    'La secrétaire': 'f3',
    'La radio': 'f3',
    'La commerçante': 'f3',
    'La caissière': 'f3',
    'La réceptionniste': 'f3',
    'Une passante': 'f3',
    'Une touriste': 'f3',
    Annonce: 'f3',
    Hugo: 'm1',
    Sam: 'm2',
    Marc: 'm2',
    Paul: 'm2',
    'M. Martin': 'm2',
    'Le serveur': 'm2',
    'Le réceptionniste': 'm2',
    "L'agent": 'm2',
    "L'employé": 'm2',
    'Le marchand': 'm2',
    'Le vendeur': 'm2',
    'Le salon': 'm2',
    'Le restaurant': 'm2',
    'Un passant': 'm2',
    'Un touriste': 'm2',
    'Le caissier': 'm2',
    "L'employée": 'f3',
    // A2 roles
    'Le médecin': 'm2',
    'La médecin': 'f3',
    'Le pharmacien': 'm2',
    'La pharmacienne': 'f3',
    "L'hôtesse": 'f3',
    'Le contrôleur': 'm2',
    'La contrôleuse': 'f3',
    'La propriétaire': 'f3',
    'Le propriétaire': 'm2',
    'Le collègue': 'm2',
    'La collègue': 'f3',
    'La cheffe': 'f3',
    'Le chef': 'm2',
    'La grand-mère': 'f3',
    'Le grand-père': 'm2',
    'Thomas': 'm2',
    'Chloé': 'f3',
    'Mamie': 'f3',
  },
}
