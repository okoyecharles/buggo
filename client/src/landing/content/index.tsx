import Link from "next/link";
import React from "react";
import LandingHero from "./Hero";
import LandingSection from "./Section";

const LandingContent = () => {
  return (
    <>
      <LandingHero />

      <div id="features" className="text-gray-200">
        <LandingSection youtubeId="VviqVds5OtU">
          <h2 className="font-bold text-[26px] md:text-[37.5px] lg:text-[42px] leading-8 md:leading-[2.75rem] lg:leading-[3.3rem] bg-gradient-to-r from-orange-400 to-orange-600 inline-block text-transparent bg-clip-text">
            Centralized Project Management
          </h2>
          <p className="font-noto text-[clamp(14px,2vw,16px)] mt-6">
            With our platform, you can easily create, invite, search, and track
            projects from a single dashboard. Say goodbye to endless email
            chains and missed deadlines.
          </p>
        </LandingSection>

        <LandingSection youtubeId="3AokVP3vuPw" bg="bg-gray-850" youtubeRing="ring-blue-500/80" reverse>
          <h2 className="font-bold text-[26px] md:text-[37.5px] lg:text-[42px] leading-7 sm:leading-8 md:leading-[2.75rem] lg:leading-[3.3rem] bg-gradient-to-r from-blue-400 to-blue-600 inline-block text-transparent bg-clip-text">
            Powerful Collaboration Tools
          </h2>
          <p className="font-noto text-[clamp(14px,2vw,16px)] mt-6 ">
            Create and assign your team members to tickets and work together in
            real-time to resolve issues quickly and efficiently.
          </p>
        </LandingSection>

        <LandingSection youtubeId="UG7t7GSWegI">
          <h2 className="font-bold text-[26px] md:text-[37.5px] lg:text-[42px] leading-7 sm:leading-8 md:leading-[2.75rem] lg:leading-[3.3rem] bg-gradient-to-r from-orange-400 to-orange-600 inline-block text-transparent bg-clip-text">
            Advanced Analytics
          </h2>
          <p className="font-noto text-[clamp(14px,2vw,16px)] mt-6 ">
            Get insights into your performance and team input and identify areas
            for improvement with advanced analytics features. Track key metrics
            such as ticket percentage charts, issue statistics, and more.
          </p>
        </LandingSection>
      </div>
    </>
  );
};

export default LandingContent;
