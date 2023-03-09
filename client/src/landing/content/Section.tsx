import Image from "next/image";
import React from "react";
import { BsYoutube } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";

interface Props {
  children: React.ReactNode;
  youtubeId: string;
  reverse?: boolean;
  youtubeRing?: string;
  bg?: string;
}

const LandingSection: React.FC<Props> = ({
  children,
  youtubeId,
  reverse,
  youtubeRing = "ring-orange-500/80",
  bg = "bg-gray-900",
}) => {
  const [facadeClicked, setFacadeClicked] = React.useState(false);

  return (
    <section className={`${bg} flex justify-center`}>
      <div
        className={` 
        w-[min(100%,1260px)]
        py-14 px-6 grid gap-5 grid-cols-4
        md:px-[40px] md:py-[80px] md:grid-cols-8
        lg:py-[120px] lg:grid-cols-12`}
      >
        <div
          className={`
          section-video w-full flex justify-center items-center
          col-span-4 
          lg:col-span-7
          ${reverse ? "md:col-start-5 lg:col-start-6" : "lg:col-start-1"}
        `}
        >
          <div
            className={`wrapper ring-1 rounded h-fit overflow-hidden ${youtubeRing} bg-black flex justify-center w-[min(100%,600px)]`}
          >
            {facadeClicked ? (
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full aspect-[560/315] max-w-[600px]"
              />
            ) : (
              <div
                className="relative flex justify-center cursor-pointer w-full aspect-[560/315] max-w-[600px] h-[min(337.5px,100%)]"
                onClick={() => {
                  setFacadeClicked(true);
                }}
              >
                <Image
                  src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
                  alt="yt thumbnail"
                  priority
                  width="560"
                  height="315"
                  className="h-full object-cover"
                />
                <div className="icon absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-[48px] w-[68px]">
                  <svg
                    height="100%"
                    version="1.1"
                    viewBox="0 0 68 48"
                    width="100%"
                  >
                    <path
                      className="ytp-large-play-button-bg"
                      d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                      fill="#f00"
                    ></path>
                    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
        <article
          className={`
          flex flex-col justify-center
          mt-6 md:mt-0
          col-span-4 lg:col-span-4 md:row-start-1
          ${reverse ? "md:col-start-1 lg:col-start-1" : "lg:col-start-9"}
        `}
        >
          {children}
        </article>
      </div>
    </section>
  );
};

export default LandingSection;
