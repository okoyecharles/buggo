import Image from "next/image";
import React from "react";

const LandingFooter = () => {
  return (
    <footer className="flex text-gray-200">
      <div className="flex flex-1 gap-4 items-center p-3 text-gray-100 font-open md:px-8 gap-4 h-20 ring-1">
        <div className="logo">
          <Image src={"/text-logo.png"} height={20} width={100} alt="buggo" />
        </div>
        <span>
          Copyright © 2023{" "}
          <a
            className="text-bold text-white hover:underline"
            href="https://okoyecharles.com"
            target="_blank"
            rel="norefferer noopener"
          >
            Okoye Charles
          </a>
        </span>
      </div>
    </footer>
  );
};

export default LandingFooter;
