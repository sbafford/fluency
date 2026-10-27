import { useEffect, useState } from 'react'

/*
 * A minimal hash router. Hash URLs work when the built app is opened from any
 * folder or hosted on GitHub Pages, with no server configuration.
 */

export type Route =
  | { name: 'today' }
  | { name: 'learn' }
  | { name: 'lesson'; id: string }
  | { name: 'practise' }
  | { name: 'review'; mode: 'due' | 'extra' }
  | { name: 'listen'; id: string }
  | { name: 'talk'; id: string }
  | { name: 'progress' }
  | { name: 'settings' }

export function parse(hash: string): Route {
  const [path, ...rest] = hash.replace(/^#\/?/, '').split('/')
  const id = decodeURIComponent(rest.join('/'))
  switch (path) {
    case 'learn':
      return { name: 'learn' }
    case 'lesson':
      return id ? { name: 'lesson', id } : { name: 'learn' }
    case 'practise':
      return { name: 'practise' }
    case 'review':
      return { name: 'review', mode: id === 'extra' ? 'extra' : 'due' }
    case 'listen':
      return id ? { name: 'listen', id } : { name: 'practise' }
    case 'talk':
      return id ? { name: 'talk', id } : { name: 'practise' }
    case 'progress':
      return { name: 'progress' }
    case 'settings':
      return { name: 'settings' }
    default:
      return { name: 'today' }
  }
}

export function href(route: Route): string {
  switch (route.name) {
    case 'today':
      return '#/'
    case 'lesson':
    case 'listen':
    case 'talk':
      return `#/${route.name}/${encodeURIComponent(route.id)}`
    case 'review':
      return `#/review/${route.mode}`
    default:
      return `#/${route.name}`
  }
}

export function go(route: Route) {
  window.location.hash = href(route)
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}
