import React from "react";
import Head from "next/head";
import Header from "../src/landing/header";
import Footer from "../src/landing/footer";
import Content from "../src/landing/content";

const Landing = () => {
  return (
    <>
      <Head>
        <title>Buggo | Issue tracking software</title>
        <meta
          name="description"
          content="Buggo is an issue tracking software that helps you track and manage your bugs and issues while working together in real-time to resolve them efficiently."
        />
        <meta
          name="keywords"
          content="buggo, issue tracking, bug tracking, issue tracking software, bug tracking software, issue tracker, bug tracker, issue management, bug management, issue management software, bug management software, issue management tool, bug management tool, issue management tool, bug management tool, issue management system, bug management system, issue management system, bug management system, issue management platform, bug management platform, issue management platform, bug management platform, issue management app, bug management app, issue management app, bug management app, issue management software, bug management"
        />
        <meta name="author" content="Okoye Charles" />
        <meta name="robots" content="index, follow" />


        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Buggo | Issue Tracking Software" />
        <meta
          property="og:site_name"
          content="Buggo | Issue Tracking Software"
        />
        <meta property="og:url" content="https://buggo.vercel.app" />
        <meta
          property="og:description"
          content="Buggo is an issue tracking software that helps you track and manage your bugs and issues while working together in real-time to resolve them efficiently."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://buggo.vercel.app/og.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:creator" content="@OkoyeCharles_" />
        <meta property="twitter:url" content="https://buggo.vercel.app" />
        <meta
          property="twitter:title"
          content="Buggo | Issue Tracking Software"
        />
        <meta
          property="twitter:description"
          content="Buggo is an issue tracking software that helps you track and manage your bugs and issues while working together in real-time to resolve them efficiently."
        />
        <meta
          property="twitter:image"
          content="https://buggo.vercel.app/og.png"
        />
      </Head>
      <main>
        <Header />
        <Content />
        <Footer />
      </main>
    </>
  );
};

export default Landing;
