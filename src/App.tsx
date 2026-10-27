import { useEffect } from 'react'
import { Learn } from './screens/Learn'
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
  const { pack } = useApp()

  useEffect(() => {
    document.documentElement.lang = 'en'
    document.title = `${pack.nativeName.toLowerCase()} · fluency`
  }, [pack])

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
      {route.name === 'practise' && <Practise />}
      {route.name === 'progress' && <Progress />}
      {route.name === 'settings' && <Settings />}
    </Shell>
  )
}
