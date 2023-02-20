export const extractJWT = (cookie: string | undefined) =>
  cookie
    ?.split(';')
    ?.map((c: string) => c.trim())
    ?.filter((c: string) => c.startsWith(`jwt_${process.env.ETY_ENV}`))?.[0]
    ?.split('=')[1]
