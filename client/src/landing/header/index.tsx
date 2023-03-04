import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiLinkExternal } from "react-icons/bi";

const LandingHeader = () => {
  return (
    <header className="flex flex-col z-40 text-white">
      <div className="flex items-center p-3 text-gray-100 font-open md:px-8 gap-4 h-20 ring-1">
        <div className="logo font-bold mr-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image src={"/text-logo.png"} height={20} width={100} alt="buggo" />
          </Link>
        </div>

        <ul className="text-ss font-bold gap-6 hidden lg:flex">
          <li className="hover:underline">
            <Link href="#features">Features</Link>
          </li>
          <li className="hover:underline">
            <Link href="#how-it-works">How it works</Link>
          </li>
          <li className="hover:underline">
            <a
              href="https://okoyecharles.com"
              className="flex gap-1 items-center"
              target="_blank"
              rel="norefferer noopener"
            >
              The Creator <BiLinkExternal className="text-md" />
            </a>
          </li>
        </ul>

        <Link href="/login" className="ml-auto">
          <button className="font-open font-semibold text-sm text-gray-900 flex justify-center items-center rounded py-1 px-3 bg-white">
            Login
          </button>
        </Link>
      </div>
    </header>
  );
};

export default LandingHeader;
