import { RefObject, useEffect, useMemo, useState } from 'react'

export default function useOnScreen(ref: RefObject<HTMLElement>) {
  const [isIntersecting, setIntersecting] = useState(false)
  const [everShown, setEverShown] = useState(false)

  const observer = useMemo(() => {
    if (
      typeof window !== 'undefined' &&
      'IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'intersectionRatio' in window.IntersectionObserverEntry.prototype
    ) {
      return new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      )
    }

    return null
  }, [ref])

  useEffect(() => {
    const currentObserver = observer

    if (currentObserver) {
      currentObserver.observe(ref.current as Element)
      return () => currentObserver.disconnect()
    }
  }, [observer, ref])

  useEffect(() => {
    if (isIntersecting) {
      setEverShown(true)
    }
  }, [isIntersecting])

  return { isIntersecting, everShown }
}
