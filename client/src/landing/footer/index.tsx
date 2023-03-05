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

const LandingFooter = () => {
  return (
    <footer className="flex justify-center text-gray-200 bg-gray-950 pt-5 pb-14 px-4 lg:p-10">
      <div className="max-w-[1260px]">
        <div className="flex flex-col md:flex-row gap-4 md:gap-24">
          <section className="flex-1 flex flex-col gap-2">
            <h2 className="font-black text-[clamp(1.25rem,1.5vw+0.5rem,1.5rem)] text-blue-400 leading-7">
              TRACK BUGS AND ISSUES LIKE NEVER BEFORE
            </h2>
            <span className="text-sm font-noto text-gray-200">
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
            <p></p>
          </section>
          <section className="flex-1 flex flex-col gap-4 mb-4">
            <h3 className="font-noto text-ss font-medium text-blue-400">
              Creator's Links
            </h3>
            <ul className="flex gap-4 text-ss text-white uppercase font-medium font-open">
              <li>
                <a
                  href="https://okoyecharles.com"
                  className="flex gap-[1ch] items-center"
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
                  target="_blank"
                  rel="norefferer noopener"
                >
                  <FaAngellist className="text-2xl" />
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="flex items-center justify-between border-t border-orange-500 pt-6">
          <div className="footer-logo">
            <Image src={"/text-logo.png"} height={20} width={100} alt="buggo" />
          </div>

          <Link href="/register" className="ml-auto">
            <button
              className="font-open font-semibold text-sm text-orange-50 flex justify-center items-center rounded-full py-2 px-3 bg-orange-500"
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
