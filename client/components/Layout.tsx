import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { storeType } from "../redux/configureStore";
import { useSelector } from "react-redux";
import { MdOutlineArrowDropDown, MdLogout } from "react-icons/md";
import { useSpring, a } from "@react-spring/web";

const Layout: React.FC = () => {
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <>
      <nav className="flex items-center shadow-sm shadow-gray-950 bg-gray-800 justify-between p-3 text-gray-100 font-open md:px-8">
        <div className="logo font-bold">
          <Link href="/">Bug Tracker</Link>
        </div>
        <div className="profile flex items-center gap-2 relative select-none">
          <Image
            src={currentUser?.user.image || ""}
            width="200"
            height="200"
            alt="profile__image"
            className="rounded-full h-10 w-10"
          />
          <div className="profile-info flex flex-col h-full justify-start">
            <p className="text-sm font-bold">{currentUser?.user.name}</p>
            <p className="text-xsm text-orange-500/80 uppercase font-bold">
              {currentUser?.user.admin ? "admin" : "dev"}
            </p>
          </div>
          <MdOutlineArrowDropDown
            className={`text-4xl text-gray-300 hover:text-gray-200 z-50 cursor-pointer hover:bg-gray-700 rounded-full transition-colors ${
              openDropdown && "rotate-180"
            }`}
            onClick={() => setOpenDropdown((state) => !state)}
          />
          <NavPopup open={openDropdown} setOpen={setOpenDropdown} />
        </div>
      </nav>
      <aside></aside>
      <main></main>
    </>
  );
};

const NavPopup: React.FC<{ open: boolean; setOpen: any }> = ({
  open,
  setOpen,
}) => {
  const spring = useSpring({
    opacity: 0,
    y: -10,
    scale: 0.8,
    to: {
      opacity: open ? 1 : 0,
      y: open ? 0 : -10,
      scale: open ? 1 : 0.8,
    },
    config: {
      tension: 350,
      friction: 20,
    },
  });

  return (
    <a.div
      className="absolute top-[calc(100%+1rem)] right-1 w-48 bg-gray-900 shadow-lg shadow-gray-950/40 rounded-md select-none isolate"
      style={spring}
    >
      <div
        className="outclick fixed h-screen w-screen top-0 left-0 -z-10 opacity-0"
        onClick={() => setOpen(false)}
      />
      <div className="flex flex-col gap-2 py-2 z-10">
        <Link
          href="/logout"
          className="py-2 px-4 group hover:bg-gray-800 flex justify-between items-center"
        >
          Logout
          <MdLogout className="inline-block text-xl text-gray-500 group-hover:text-gray-300" />
        </Link>
      </div>
    </a.div>
  );
};

export default Layout;
