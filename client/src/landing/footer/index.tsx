import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaAngellist,
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { storeType } from "../../../redux/configureStore";

const LandingFooter = () => {
  const currentUser = useSelector((store: storeType) => store.currentUser.user);

  return (
    <footer className="flex justify-center text-gray-200 bg-gray-950 py-4 px-4 lg:p-10">
      <div className="w-[min(100%,1260px)]">
        <div className="grid md:grid-cols-5 gap-4">
          <section className="flex-1 flex flex-col gap-2 md:col-span-2">
            <h2 className="font-black text-[clamp(1.25rem,1.5vw+0.5rem,1.5rem)] text-blue-400 leading-7 ">
              TRACK BUGS AND ISSUES LIKE NEVER BEFORE
            </h2>
          </section>
          <section className="flex-1 flex flex-col gap-2 mb-4 md:col-span-3">
            <h3 className="font-noto text-ss font-medium text-blue-400">
              Creator's Links
            </h3>
            <ul className="flex gap-4 text-ss text-white uppercase font-medium font-open">
              <li>
                <a
                  href="https://okoyecharles.com"
                  className="flex gap-[1ch] items-center"
                  aria-label="Website"
                  target="_blank"
                  rel="norefferer noopener"
                >
                  <FaGlobe className="text-2xl" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/okoyecharles"
                  className="flex gap-[1ch] items-center"
                  aria-label="Github"
                  target="_blank"
                  rel="norefferer noopener"
                >
                  <FaGithub className="text-2xl" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/charles-k-okoye"
                  className="flex gap-[1ch] items-center"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="norefferer noopener"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/okoyecharles_"
                  className="flex gap-[1ch] items-center"
                  aria-label="Twitter"
                  target="_blank"
                  rel="norefferer noopener"
                >
                  <FaTwitter className="text-2xl" />
                </a>
              </li>
              <li>
                <a
                  href="https://angel.co/u/charles-k-okoye"
                  className="flex gap-[1ch] items-center"
                  aria-label="AngelList"
                  target="_blank"
                  rel="norefferer noopener"
                >
                  <FaAngellist className="text-2xl" />
                </a>
              </li>
            </ul>
            <span className="text-sm font-noto text-gray-300 mt-2">
              Copyright © 2023{" "}
              <a
                className="text-bold hover:underline truncate text-white"
                href="https://okoyecharles.com"
                target="_blank"
                rel="norefferer noopener"
              >
                Okoye Charles
              </a>
            </span>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-gray-700 pt-6">
          <div className="footer-logo">
            <Image src={"/text-logo.png"} height={20} width={100} alt="buggo" />
          </div>

          <Link
            href={currentUser ? "/dashboard" : "/register"}
            className="ml-auto"
          >
            <button
              className="font-open font-semibold text-sm text-gray-950 flex justify-center items-center rounded-full py-2 px-3 bg-white"
              tabIndex={-1}
            >
              Signup
            </button>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
