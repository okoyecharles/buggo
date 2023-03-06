import Link from "next/link";
import React from "react";
import { CgArrowLongRight } from "react-icons/cg";

const LandingHero = () => {
  return (
    <section className="hero-section text-white flex flex-col justify-center lg:items-center gap-8 p-6 min-h-[75vh] bg-gray-900">
      <h1 className="font-black text-[clamp(1.5rem,2vw+1rem,3rem)] leading-10 uppercase text-blue-400">
        Track Issues & Bugs Like Never Before ...
      </h1>
      <p className="w-auto mb-10 lg:w-3/5 lg:text-center font-noto text-[clamp(0.9rem,1vw+0.5rem,1.1rem)] text-gray-200">
        The ultimate issue tracking solution for teams of any size. Manage all
        your issues, bugs and features in one place and focus on delivering
        exceptional products and services to your customers
      </p>

      <Link href="/register" className="rounded-full" tabIndex={-1}>
        <button
          name="Get Started"
          className="bg-gray-50 font-medium py-2 px-12 rounded-full text-gray-900 transition-all hover:shadow-xl text-lg hover:text-black flex items-center relative isolate group"
        >
          <span className="bg-white px-1 group-hover:text-blue-600 transition-colors">Get Started</span>
          <CgArrowLongRight className="text-lg absolute top-1/2 -translate-y-1/2 right-12 -z-10 transition-all group-hover:translate-x-[calc(100%+0.25rem)] text-blue-500" />
        </button>
      </Link>
    </section>
  );
};

export default LandingHero;
