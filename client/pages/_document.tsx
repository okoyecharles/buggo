import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-gray-800 overflow-x-hidden">
        <Main />
        <div id="portal" />
        <NextScript />
      </body>
    </Html>
  );
}
