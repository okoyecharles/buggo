import React from "react";
import Head from "next/head";
import Header from "../src/landing/header";
import Footer from "../src/landing/footer";

const Landing = () => {
  return (
    <>
      <Head>
        <title>Buggo | Issue & Bug tracking software</title>
      </Head>
      <main>
        <Header />
        <section className="hero-section text-white flex flex-col justify-center items-center gap-8 p-4 min-h-[50svh] ring-1">
          <h1 className="font-black text-[clamp(1.5rem,2vw+1rem,2rem)] leading-10">
            Keep Track of Bugs & Issues Like Never Before
          </h1>
          <p className="w-1/2 text-center">
            The ultimate issue tracking solution for teams of any size. Say
            goodbye to endless emails and confusing spreadsheets. Manage all
            your issues, bugs and features in one place and focus on delivering
            exceptional products and services to your customers
          </p>

          <div className="flex gap-4">
            <button className="bg-white text-gray-900 font-bold py-2 px-4 rounded">
              Login
            </button>
            <button className="bg-white text-gray-900 font-bold py-2 px-4 rounded">
              Register
            </button>
          </div>
        </section>
        <div id="features" className="text-gray-200">
          <section className="p-4 ring-1">
            <h2 className="font-bold text-[clamp(1.3rem,1.8vw+1rem,1.7rem)] leading-10 text-white">
              Centralized Project Management
            </h2>
            <p>
              With our platform, you can easily create, invite, search, and
              track projects from a single dashboard. Say goodbye to endless
              email chains and missed deadlines.
            </p>
          </section>
          <section className="p-4 ring-1">
            <h2 className="font-bold text-[clamp(1.3rem,1.8vw+1rem,1.7rem)] leading-10 text-white">
              Powerful Collaboration Tools
            </h2>
            <p>
              Assign your team members to tickets and work together in real-time
              to resolve issues quickly and efficiently.
            </p>
          </section>
          <section className="p-4 ring-1">
            <h2 className="font-bold text-[clamp(1.3rem,1.8vw+1rem,1.7rem)] leading-10 text-white">
              Advanced Analytics
            </h2>
            <p>
              Get insights into your performance and team input and identify
              areas for improvement with advanced analytics features. Track key
              metrics such as tickets percentage charts, issue statistics, and
              more.
            </p>
          </section>
        </div>

        <section className="coa text-gray-200 flex flex-col items-center gap-2 p-4 ring-1">
          <p>Ready to take your issue tracking to the next level?</p>
          <button className="bg-white text-gray-900 font-bold py-2 px-4 rounded">
            Sign Up Now
          </button>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Landing;
