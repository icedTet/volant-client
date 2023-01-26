import Head from "next/head";
import { AppProps } from "next/app";
import "../styles/index.css";
import { useEffect } from "react";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (!globalThis.navigator) return;
    // FaceAI.getInstance().init();
  }, []);
  return (
    <>
      <Head>
        <title>Volant</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/volant.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
