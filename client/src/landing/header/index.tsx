import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiLinkExternal } from "react-icons/bi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";

const LandingHeader = () => {
  const [linksOpen, setLinksOpen] = React.useState(false);

  return (
    <header className="flex flex-col z-40 text-white">
      <div className="flex items-center p-3 text-gray-100 font-open md:px-8 gap-4 h-20 ring-1 ring-orange-500">
        <div className="logo font-bold mr-auto">
          <Link href="/" className="flex items-center gap-2">
            <Image src={"/text-logo.png"} height={20} width={100} alt="buggo" />
          </Link>
        </div>

        <ul
          className={`text-ss font-bold gap-6 flex flex-col lg:flex-row fixed lg:static bg-gray-900 border-r border-gray-800 lg:border-none lg:bg-transparent top-0 left-0 h-full lg:h-auto pl-4 pr-10 py-20 lg:p-0 uppercase lg:normal-case z-40 lg:z-auto ${
            linksOpen ? "-translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-all`}
        >
          <li className="hover:underline">
            <Link href="#features">Features</Link>
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

        <div
          className={`links-outclick fixed top-0 left-0 w-screen h-screen bg-black/20 z-30 backdrop-blur-[2px] ${
            linksOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-all`}
          onClick={() => {
            setLinksOpen((prev) => !prev);
          }}
        />

        <Link href="/login" className="ml-auto">
          <button
            className="font-open font-semibold text-ss text-gray-900 flex justify-center items-center rounded-full py-1 px-3 bg-white"
            tabIndex={-1}
          >
            Login
          </button>
        </Link>
        <button
          className="lg:hidden h-[33px] w-[33px] relative rounded bg-gray-850"
          onClick={() => {
            setLinksOpen((prev) => !prev);
          }}
        >
          <HiOutlineMenuAlt3
            className={`text-2xl absolute top-1 left-1 ${
              linksOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-1"
            } transition-all`}
          />
          <IoMdClose
            className={`text-2xl absolute top-1 left-1 ${
              !linksOpen ? "-rotate-180 opacity-0" : "rotate-0 opacity-1"
            } transition-all`}
          />
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;
