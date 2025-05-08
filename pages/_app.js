import React from 'react'; 
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>ShortsApp - Video Sharing Platform</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Watch and share short videos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
