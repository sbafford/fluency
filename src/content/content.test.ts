import { languages } from './index'
import { describePack } from './packChecks'

/*
 * Content integrity checks. Every language pack must pass these, so authoring
 * mistakes (a missing answer option, a broken reference) fail the build rather
 * than surfacing mid-lesson.
 */

for (const pack of Object.values(languages)) describePack(pack)
