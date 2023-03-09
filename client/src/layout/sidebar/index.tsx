import React from "react";
import navLinks from "../data/navlinks";
import { storeType } from "../../../redux/configureStore";
import { useSelector } from "react-redux";
import { RiArrowRightSLine } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import SideBarLink from "./Link";

interface SideBarProps {
  expandNav: boolean;
  setExpandNav: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar: React.FC<SideBarProps> = ({ expandNav, setExpandNav }) => {
  const user = useSelector((store: storeType) => store.currentUser.user);

  return (
    <aside
      className={`bg-gray-950 border-t lg:border-none border-t-gray-700 px-2 py-1 flex gap-3 w-screen fixed bottom-0 z-50 h-[60px] lg:h-auto lg:z-0 lg:flex-col lg:py-10 lg:left-0 lg:top-0 ${
        expandNav ? "lg:w-36" : "lg:w-[60px]"
      } lg:transition-all`}
    >
      <ul
        className="flex 
        gap-8 md:gap-14 items-center font-noto justify-center w-full lg:flex-col lg:gap-3 lg:pt-16 lg:items-start"
      >
        {navLinks.map((link) => {
          return !user?.admin && link.admin ? null : (
            <SideBarLink key={link.name} link={link} expandNav={expandNav} />
          );
        })}
      </ul>
      <div className="relative hidden lg:block mt-auto w-full h-10">
        <button
          id="expand"
          className="p-3 absolute right-0 translate-x-2/4 bottom-0 ring-1 ring-gray-700 bg-gray-850 text-2xl text-gray-300 rounded-lg hover:bg-gray-800 hover:ring-gray-600 active:bg-gray-850 hover:text-white transition-colors"
          onClick={() => setExpandNav(!expandNav)}
        >
          <RiArrowRightSLine
            className={`text-orange-500 text-2xl transition ${
              expandNav ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
        <Tooltip
          anchorId="expand"
          content={expandNav ? "Collapse" : "Expand"}
          place="right"
        />
      </div>
    </aside>
  );
};

export default SideBar;
