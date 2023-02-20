import React from 'react'
import '../styles/global.scss'
import type { AppProps } from 'next/app'
import { CssBaseline, ThemeProvider } from '@mui/material'
import darkTheme from '../../shared/theme'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline enableColorScheme />
    <Component {...pageProps} />
  </ThemeProvider>
)

export default MyApp
