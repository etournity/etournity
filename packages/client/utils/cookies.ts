import { User } from '@generated/graphql'

export const getCookie = (name: string): string =>
  document.cookie.split('; ').reduce((r, v) => {
    const parts = v.split('=')
    return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')

export interface Token {
  user: User
  iat: number
  exp: number
  sub: string
}

export const parseJWT = (cookie: string): Token | undefined => {
  try {
    return JSON.parse(window.atob(getCookie(cookie).split('.')[1] || ''))
  } catch (_: unknown) {
    return undefined
  }
}
