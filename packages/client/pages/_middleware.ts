import { chain, nextSafe, strictDynamic } from '@next-safe/middleware'
import { NextResponse } from 'next/server'

const isLocal = process.env.ETY_ENV === 'local'

export default isLocal
  ? () => NextResponse.next()
  : chain(
      nextSafe(() => ({
        contentSecurityPolicy: {
          'default-src': [
            "'self'",
            '*.etournity.com',
            '*.sentry.io',
            '*.iubenda.com',
          ],
          'connect-src': [
            "'self'",
            'wss://*.etournity.com',
            '*.etournity.com',
            '*.sentry.io',
            '*.mixpanel.com',
            'cdn.mxpnl.com',
            '*.iubenda.com',
            'vitals.vercel-insights.com',
          ],
          'script-src': ['https://cdn.mxpnl.com', 'https://cdn4.mxpnl.com'],
          'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.tiny.cloud'],
          'frame-src': ['*.consensu.org', 'https://discord.com'],
          'img-src': [
            "'self'",
            '*.etournity.com',
            'data:',
            'https://cdn.discordapp.com',
            'https://i.ytimg.com',
            'https://sp.tinymce.com',
            'https://*.imgur.com',
          ],
          'upgrade-insecure-requests': [],
          'report-uri': ['https://etournityapp.report-uri.com/r/d/csp/enforce'],
        },
        permissionsPolicy: {
          fullscreen: "'self' *.etournity.com",
        },
      })),
      strictDynamic()
    )
