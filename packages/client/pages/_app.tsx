import React from 'react'

import '@utils/useLayoutEffectSsrFix'

import { ApolloProvider } from '@apollo/client'
import { useApollo } from './../apollo'
import { AppProps } from 'next/app'

import AppLayout, { AppLayoutProps } from '@components/layouts/appLayout'
import { NextComponentType } from 'next'

import 'modern-normalize'
import 'nprogress/css/nprogress.scss'
import '@style/global.scss'

import CssBaseline from '@mui/material/CssBaseline'
import ThemeProvider from '@mui/system/ThemeProvider'
import darkTheme from '@etournity/shared/theme'

import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'

import { Router } from 'next/router'
import NProgress from 'nprogress'
import { Toaster } from 'react-hot-toast'

import Head from 'next/head'
import Script from 'next/script'

import createEmotionCache from '@utils/createEmotionCache'
import { CacheProvider } from '@emotion/react'
NProgress.configure({
  showSpinner: false,
})

let progressBarTimeout: NodeJS.Timeout | null = null

const startProgressBar = () => {
  if (progressBarTimeout) {
    clearTimeout(progressBarTimeout)
  }

  progressBarTimeout = setTimeout(() => {
    NProgress.start()
  }, 250)
}

const stopProgressBar = () => {
  if (progressBarTimeout) {
    clearTimeout(progressBarTimeout)
  }

  NProgress.done()
}

Router.events.on('routeChangeStart', startProgressBar)
Router.events.on('routeChangeComplete', stopProgressBar)
Router.events.on('routeChangeError', stopProgressBar)

dayjs.extend(isBetween)

export interface AppComponent {
  layoutProps?: AppLayoutProps
}

const App = ({
  Component,
  pageProps,
}: AppProps & {
  Component: AppComponent & NextComponentType
}) => {
  const apollo = useApollo(pageProps.initialApolloState)

  const emotionCache = createEmotionCache()
  const cookieBanner = `
    var _iub = _iub || [];
    _iub.csConfiguration = {"countryDetection":true,"cookiePolicyInOtherWindow":true,"consentOnContinuedBrowsing":false,"lang":"en","siteId":2349222,"floatingPreferencesButtonDisplay":false,"cookiePolicyId":13634607,"cookiePolicyUrl":"https://etournity.com/imprintPrivacy","footer":{}, "banner":{ "position":"float-bottom-right","backgroundOverlay":false,"textColor":"white","backgroundColor":"#1c1c1c","rejectButtonDisplay":true,"rejectButtonColor":"#ffffff","rejectButtonCaptionColor":"#010101","acceptButtonDisplay":true,"acceptButtonColor":"#ffffff","acceptButtonCaptionColor":"#010101","customizeButtonDisplay":true,"customizeButtonColor":"#4b4b4b","customizeButtonCaptionColor":"white","customizeButtonCaption":"Learn more" }};
    var s = document.createElement('script')
    s.src = '//cdn.iubenda.com/cs/iubenda_cs.js'
    s.setAttribute('async', true)
    document.body.appendChild(s)`

  if (!process.env.TINY_KEY) console.error('TINY_KEY env variable missing')

  return (
    <ApolloProvider client={apollo}>
      <Toaster position="top-right" containerStyle={{ top: '4.5rem' }} />
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={darkTheme}>
          {process.env.ETY_ENV === 'production' && (
            <Script id="inline-after-test-script">{cookieBanner}</Script>
          )}
          <CssBaseline enableColorScheme />
          <AppLayout {...Component.layoutProps}>
            <Head>
              <title>
                {process.env.ETY_ENV === 'local'
                  ? 'Local - Etournity'
                  : process.env.ETY_ENV === 'develop'
                  ? 'Develop - Etournity'
                  : 'Etournity'}
              </title>
            </Head>
            <Component {...pageProps} />
          </AppLayout>
        </ThemeProvider>
      </CacheProvider>
    </ApolloProvider>
  )
}

export default App
