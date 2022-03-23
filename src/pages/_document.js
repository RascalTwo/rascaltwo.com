
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png"></link>
          <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-touch-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-touch-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-touch-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-touch-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-touch-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-touch-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-touch-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-touch-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
          <meta name="msapplication-TileColor" content="#ffc40d" />
          <meta name="msapplication-TileImage" content="/favicon/mstile-144x144.png" />
          <meta name="theme-color" content="#172b36" />

          <meta name="twitter:widgets:theme" content="dark"></meta>

          <meta property="og:locale" content="en_US"/>
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,900;1,900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <div id="modal"></div>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
