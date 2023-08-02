import { NextPage } from "next";
import type { AppProps } from "next/app";
import React, { ReactElement, ReactNode } from "react";
import Head from "next/head";
import { trpc } from "@/utils/trpc";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "styles/index.css";

// export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
//   getLayout?: (page: ReactElement) => ReactNode;
// };

// type AppPropsWithLayout = AppProps & {
//   Component: NextPageWithLayout;
// };

const MyApp = ({ Component, pageProps }: AppProps) => (
  <React.Fragment>
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <title>訊號處理系統</title>
    </Head>
    <Component {...pageProps} />
  </React.Fragment>
);

export default trpc.withTRPC(MyApp);
