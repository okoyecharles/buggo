import React from "react";
import Head from "next/head";
import Header from "../src/landing/header";
import Footer from "../src/landing/footer";
import Link from "next/link";

const Landing = () => {
  return (
    <>
      <Head>
        <title>Buggo | Issue & Bug tracking software</title>
      </Head>
      <main>
        <Header />
        <section className="hero-section text-white flex flex-col justify-center lg:items-center gap-8 p-4 min-h-[75vh] bg-gradient-to-b from-orange-500 to-orange-600">
          <h1 className="font-black text-[clamp(1.5rem,2vw+1rem,3rem)] leading-10 uppercase">
            Track Issues & Bugs Like Never Before ...
          </h1>
          <p className="w-auto lg:w-3/5 lg:text-center font-noto text-[clamp(0.9rem,1vw+0.5rem,1.1rem)]">
            The ultimate issue tracking solution for teams of any size. Say
            goodbye to endless emails and confusing spreadsheets. Manage all
            your issues, bugs and features in one place and focus on delivering
            exceptional products and services to your customers
          </p>

          <Link href="/register" className="rounded-full">
            <button className="bg-gray-950 font-medium py-3 px-10 rounded-full text-white transition-all hover:shadow-lg hover:text-orange-50 ring-orange-600/90">
              Get Started
            </button>
          </Link>
        </section>
        <div id="features" className="text-gray-200">

          <section className="p-6 lg:p-12 flex gap-8 flex-col lg:flex-row lg:min-h-[75vh] bg-gradient-to-r from-gray-850 to-gray-900 items-center">
            <article className="flex-1">
              <h2 className="font-bold text-[clamp(1.3rem,2vw+1rem,2.5rem)] bg-gradient-to-r from-orange-400 to-orange-600 inline-block text-transparent bg-clip-text">
                Centralized Project Management
              </h2>
              <p className="font-noto text-[clamp(0.9rem,1vw+0.5rem,1.1rem)]">
                With our platform, you can easily create, invite, search, and
                track projects from a single dashboard. Say goodbye to endless
                email chains and missed deadlines.
              </p>
            </article>
            <div className="illustration flex-1">
              <div className="wrapper ring-2 rounded overflow-hidden ring-orange-500/80 bg-black flex justify-center">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/VviqVds5OtU"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full aspect-[560/315] max-w-[600px]"
                />
              </div>
            </div>
          </section>

          <section className="p-6 lg:p-12 flex gap-8 flex-col lg:flex-row-reverse lg:min-h-[75vh] bg-gradient-to-r from-gray-900 to-gray-950 items-center">
            <article className="flex-1">
              <h2 className="font-bold text-[clamp(1.3rem,2vw+1rem,2.5rem)] bg-gradient-to-r from-blue-400 to-blue-600 inline-block text-transparent bg-clip-text">
                Powerful Collaboration Tools
              </h2>
              <p className="font-noto text-[clamp(0.9rem,1vw+0.5rem,1.1rem)]">
                Create and assign your team members to tickets and work together
                in real-time to resolve issues quickly and efficiently.
              </p>
            </article>
            <div className="illustration flex-1">
              <div className="wrapper ring-2 rounded overflow-hidden ring-blut-500/80 bg-black flex justify-center">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/3AokVP3vuPw"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full aspect-[560/315] max-w-[600px]"
                />
              </div>
            </div>
          </section>

          <section className="p-6 lg:p-12 flex gap-8 flex-col lg:flex-row lg:min-h-[75vh] bg-gradient-to-r from-gray-850 to-gray-900 items-center">
            <article className="flex-1">
              <h2 className="font-bold text-[clamp(1.3rem,2vw+1rem,2.5rem)] bg-gradient-to-r from-orange-400 to-orange-600 inline-block text-transparent bg-clip-text">
                Advanced Analytics
              </h2>
              <p className="font-noto text-[clamp(0.9rem,1vw+0.5rem,1.1rem)]">
                Get insights into your performance and team input and identify
                areas for improvement with advanced analytics features. Track
                key metrics such as ticket percentage charts, issue statistics,
                and more.
              </p>
            </article>
            <div className="illustration flex-1">
              <div className="wrapper ring-2 rounded overflow-hidden ring-orange-500/80 bg-black flex justify-center">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/UG7t7GSWegI"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full aspect-[560/315] max-w-[600px]"
                ></iframe>
              </div>
            </div>
          </section>

        </div>

        <Footer />
      </main>
    </>
  );
};

export default Landing;
