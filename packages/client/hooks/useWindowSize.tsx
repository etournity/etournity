import { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles/'

interface WindowSizeReturn {
  width: number
  height: number
  contentWidth: number
  contentHeight: number
  isMobile: boolean
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  breakpointAsNumber: number
}
export const useWindowSize = (): WindowSizeReturn => {
  const [isMobile, setIsMobile] = useState<boolean>(true)
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
    conentWidth: number
    contentHeight: number
  }>({ conentWidth: 0, contentHeight: 0, width: 0, height: 0 })
  const theme = useTheme()
  const [breakpoint, setBreakpoint] = useState<
    'xs' | 'sm' | 'md' | 'lg' | 'xl'
  >('xs')

  const [breakpointAsNumber, setBreakpointAsNumber] = useState<number>(0)

  const breakpointAtWidth = (width: number) => {
    if (width >= theme.breakpoints.values.lg) {
      return 'xl'
    }

    if (width >= theme.breakpoints.values.md) {
      return 'lg'
    }

    if (width >= theme.breakpoints.values.sm) {
      return 'md'
    }

    if (width >= theme.breakpoints.values.xs) {
      return 'sm'
    }

    return 'xs'
  }

  const getBreakpointAsNumber = (
    breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  ) => theme.breakpoints.values[breakpoint]

  useEffect(() => {
    if (window) {
      const handleResize = () => {
        setIsMobile(window.innerWidth < theme.breakpoints.values.md)
        setBreakpoint(breakpointAtWidth(window.innerWidth))
        setBreakpointAsNumber(
          getBreakpointAsNumber(breakpointAtWidth(window.innerWidth))
        )
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
          conentWidth: window.innerWidth,
          contentHeight:
            window.innerHeight -
            (window.innerWidth < theme.breakpoints.values.md ? 64 + 80 : 64),
        })
      }

      window.addEventListener('resize', handleResize)
      handleResize()
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    width: dimensions.width,
    height: dimensions.height,
    contentWidth: dimensions.conentWidth,
    contentHeight: dimensions.contentHeight,
    isMobile,
    breakpoint,
    breakpointAsNumber,
  }
}
