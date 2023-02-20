import 'modern-normalize/modern-normalize.css'
import 'nprogress/css/nprogress.scss'
import '../style/global.scss'
import '../style/variables.scss'
import { themes } from '@storybook/theming'
import { MockedProvider } from '@apollo/client/testing'
import React from 'react'
import * as NextImage from 'next/image'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { ThemeProvider } from '@mui/material'
import darkTheme from '@etournity/shared/theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    theme: themes.dark,
  },
  apolloClient: {
    MockedProvider,
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: '#1C1C1C',
      },
      {
        name: 'light',
        value: '#ffffff',
      },
    ],
  },
}

// Fixes the usage of next/image in the components
const OriginalNextImage = NextImage.default
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
})

export const decorators = [
  (Story) => (
    <ThemeProvider theme={darkTheme}>
      <Story />
    </ThemeProvider>
  ),
]
