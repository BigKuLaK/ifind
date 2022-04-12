import { Html, Head, Main, NextScript } from "next/document";

import { ENVIRONMENT } from "@config/environment";
import GridGuide from "@components/GridGuide";

export default function Document() {
  return (
    <Html className="ifind-app">
      <Head />
      <body>
        <Main />
        <NextScript />
        <GridGuide renderIf={/dev|local/i.test(ENVIRONMENT)} />
      </body>
    </Html>
  );
}
