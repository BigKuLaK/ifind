import { AppProps } from "next/app";
import Head from "next/head";
import ApolloWrapper from "@contexts/apollo";
import { Providers } from "./providers-temp";

const Application = ({ Component, pageProps }: AppProps) => {
  const adminAPIRoot = process.env.NEXT_PUBLIC_ADMIN_API_ROOT;
  const env = process.env.NEXT_PUBLIC_ENV;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="admin_api_root" content={adminAPIRoot} />
        <meta name="environment" content={env} />
      </Head>
      <ApolloWrapper>
        <Providers>
          <Component {...pageProps} />
        </Providers>
      </ApolloWrapper>
    </>
  );
};

export default Application;
