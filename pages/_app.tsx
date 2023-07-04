import {
  GetStaticProps,
  GetStaticPaths,
  GetServerSideProps,
  NextPage,
  NextPageContext,
} from "next";
import type { AppProps, AppContext } from "next/app";
import React, { ReactElement, ReactNode } from "react";
import App from "next/app";
import Head from "next/head";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/index.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>資訊處理系統</title>
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </React.Fragment>
  );
}
