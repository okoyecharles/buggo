import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-gray-800 h-[100svh]">
        <div className="overflow-x-hidden">
          <Main />
          <div id="portal" />
          <NextScript />
        </div>
      </body>
    </Html>
  );
}
