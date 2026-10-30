import { useEffect } from 'react'
import { Learn } from './screens/Learn'
import { Phrasebook } from './screens/Phrasebook'
import { LessonScreen } from './screens/LessonScreen'
import { ListeningScreen } from './screens/ListeningScreen'
import { Practise } from './screens/Practise'
import { Progress } from './screens/Progress'
import { ReviewScreen } from './screens/ReviewScreen'
import { Settings } from './screens/Settings'
import { TalkScreen } from './screens/TalkScreen'
import { Today } from './screens/Today'
import { useApp } from './state/app'
import { useRoute } from './state/router'
import { Shell } from './ui/Shell'

export default function App() {
  const route = useRoute()
  const { pack, settings } = useApp()

  useEffect(() => {
    document.documentElement.lang = 'en'
    document.title = `fluéncy · ${pack.nativeName.toLowerCase()}`
  }, [pack])

  // Appearance: an explicit choice wins; otherwise the device setting applies (see index.css).
  useEffect(() => {
    const root = document.documentElement
    if (settings.theme) root.dataset.theme = settings.theme
    else delete root.dataset.theme
  }, [settings.theme])

  // Focused activities take the whole screen; everything else sits in the shell.
  switch (route.name) {
    case 'lesson':
      return <LessonScreen key={route.id} id={route.id} />
    case 'review':
      return <ReviewScreen key={route.mode} mode={route.mode} />
    case 'listen':
      return <ListeningScreen key={route.id} id={route.id} />
    case 'talk':
      return <TalkScreen key={route.id} id={route.id} />
  }

  return (
    <Shell route={route}>
      {route.name === 'today' && <Today />}
      {route.name === 'learn' && <Learn />}
      {route.name === 'phrasebook' && <Phrasebook unit={route.unit} />}
      {route.name === 'practise' && <Practise />}
      {route.name === 'progress' && <Progress />}
      {route.name === 'settings' && <Settings />}
    </Shell>
  )
}
