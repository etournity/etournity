/* eslint-disable react/no-danger */
import React from 'react'
import { Html, Main } from 'next/document'
import Document, {
  provideComponents,
} from '@next-safe/middleware/dist/document'

export const customHead = (Head: React.FC) => (
  <Head>
    <meta charSet="utf-8" />
    <meta name="application-name" content="Etournity" />

    <meta
      name="description"
      content="Effortlessly organize - and smoothly participate in - online esports tournaments for small to medium-sized games."
    />
    <meta name="theme-color" content="#252525" />
    <meta name="msapplication-navbutton-color" content="#22ff8f" />
    <meta name="msapplication-TileColor" content="#00aba9" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <meta name="msapplication-starturl" content="/" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="Etournity" />
  </Head>
)

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return initialProps
  }

  render() {
    const { Head, NextScript } = provideComponents(this.props)

    return (
      <Html>
        {customHead(Head)}
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
