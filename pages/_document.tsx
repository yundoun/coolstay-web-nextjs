import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* Pretendard Font */}
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        {/* Meta */}
        <meta name="theme-color" content="#FFC600" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
