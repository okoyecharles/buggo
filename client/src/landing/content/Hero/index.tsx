import Link from "next/link";
import React from "react";
import { CgArrowLongRight } from "react-icons/cg";
import Image from "next/image";

const LandingHero = () => {
  return (
    <section className="hero-section text-white bg-gradient-to-b from-[#007BCD] to-blue-700">
      <div
        className="hero-section-bg flex flex-col items-center"
        style={{
          backgroundImage: "url(/hero/bg.svg)",
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "center",
          backgroundPositionY: "bottom",
          backgroundSize: 2000,
        }}
      >
        <div
          className="
        hero-section-grid w-[min(100%,1260px)]
        grid gap-5 grid-cols-4 py-14 px-6
        md:px-[40px] md:py-[80px] md:grid-cols-8
        lg:py-[120px] lg:grid-cols-12"
        >
          <div className="hero-section-content col-span-4 md:col-span-5 lg:col-start-3 lg:col-span-8">
            <h1 className="font-black text-[clamp(24px,5vw,44px)] leading-7 sm:leading-8 md:leading-10 uppercase text-white lg:text-center">
              Track Issues & Bugs Like Never Before ...
            </h1>

            <p className="font-noto text-[clamp(14px,2vw,18px)] text-white mt-6 lg:text-center">
              The ultimate issue tracking solution for teams of any size. Manage
              all your issues, bugs and features in one place and focus on
              delivering exceptional products and services to your customers
            </p>

            <div className="buttons mt-6 flex gap-6 lg:justify-center">
              <Link href="/register" tabIndex={-1} className="rounded-full">
                <button
                  name="Get Started"
                  className="bg-gray-50 font-medium py-2 px-12 rounded-full text-gray-900 transition-all hover:shadow-xl text-[16px] md:text-[18px] hover:text-black flex items-center relative isolate group"
                >
                  <span className="bg-white px-1 group-hover:text-blue-600 transition-colors">
                    Get Started
                  </span>
                  <CgArrowLongRight className="text-lg absolute top-1/2 -translate-y-1/2 right-12 -z-10 transition-all group-hover:translate-x-[calc(100%+0.25rem)] text-blue-500" />
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="
          hero-section-illustrations w-full px-4 flex justify-center items-end
          pointer-events-none select-none
          md:-mt-[175px] md:justify-end
          lg:w-[1200px] lg:justify-between lg:-mt-[200px]
        ">
          <Image
            src={"/hero/illustration-1.svg"}
            alt="Hero Illustration"
            width={550}
            height={461}
            className="w-[min(100%,300px)] md:hidden lg:block lg:w-[350px]"
          />
          <Image
            src={"/hero/illustration-2.svg"}
            alt="Hero Illustration"
            width={592}
            height={468}
            className="w-[400px] hidden md:block lg:w-[350px]"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
