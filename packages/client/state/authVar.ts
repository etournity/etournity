import { makeVar } from '@apollo/client'
import { parseJWT } from '@app/utils'

export interface Auth {
  authenticated?: boolean
  userId?: string
  expires?: Date
}

const getInitialAuthState = (): Auth => {
  const token = parseJWT(`jwt_${process.env.ETY_ENV}`)

  return {
    authenticated: Boolean(token),
    userId: token?.sub,
    expires: token?.exp ? new Date(token.exp * 1000) : undefined,
  }
}

export const authVar = makeVar<Auth>(getInitialAuthState())
