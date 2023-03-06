import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="image" content="https://buggo.vercel.app/og.png" />
        <link rel="canonical" href="https://buggo.vercel.app/" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="Okoye Charles" />
        <meta name="theme-color" content="#f47b2a" />

        {/* Apple touch icons */}
        <link
          rel="apple-touch-icon"
          sizes="48x48"
          href="/apple-icons/icon-48x48.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icons/icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="96x96"
          href="/apple-icons/icon-96x96.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icons/icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/apple-icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="256x256"
          href="/apple-icons/icon-256x256.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="384x384"
          href="/apple-icons/icon-384x384.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/apple-icons/icon-512x512.png"
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9DK2NXY3NC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'G-9DK2NXY3NC');
          `}
        </Script>
      </Head>
      <body className="bg-gray-800 h-[100svh]">
        <div className="overflow-x-hidden scroll-smooth">
          <Main />
          <div id="portal" />
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
