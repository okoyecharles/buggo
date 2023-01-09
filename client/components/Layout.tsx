import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import store, { storeType } from "../redux/configureStore";
import { useSelector } from "react-redux";
import { IoTicket } from "react-icons/io5";
import { HiUsers } from "react-icons/hi";
import { RiArrowRightSLine } from "react-icons/ri";
import { BsFillPencilFill } from "react-icons/bs";
import {
  MdOutlineArrowDropDown,
  MdLogout,
  MdSpaceDashboard,
} from "react-icons/md";
import { useSpring, a } from "@react-spring/web";
import { logout } from "../redux/actions/userActions";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";

const navLinks = [
  {
    name: "Dashboard",
    icon: (className: string) => (
      <MdSpaceDashboard className={className} title="Dashboard" />
    ),
    href: "/",
  },
  {
    name: "Tickets",
    icon: (className: string) => (
      <IoTicket className={className} title="Tickets" />
    ),
    href: "/tickets",
  },
  {
    name: "Users",
    icon: (className: string) => (
      <HiUsers className={className} title="Users" />
    ),
    href: "/users",
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [expandNav, setExpandNav] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login/?redirect=true");
      return;
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex flex-col sticky top-0 z-50">
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
              <p className="text-sm font-bold">{currentUser?.user.name.split(' ')[0]}</p>
              <p
                className={`text-xsm ${
                  currentUser?.user.admin
                    ? "text-blue-500/90"
                    : "text-orange-500/90"
                } uppercase font-bold`}
              >
                {currentUser?.user.admin ? "admin" : "dev"}
              </p>
            </div>
            <MdOutlineArrowDropDown
              id="account-toggle"
              className={`text-4xl text-gray-300 hover:text-gray-200 z-10 cursor-pointer hover:bg-gray-700 rounded-full transition focus:outline-none ${
                openDropdown && "rotate-180 bg-gray-700 text-gray-200"
              }`}
              onClick={() => setOpenDropdown((state) => !state)}
            />
            <Tooltip
              anchorId="account-toggle"
              content="Account"
              className={openDropdown ? "hidden" : ""}
            />
            <ProfileDropdown open={openDropdown} setOpen={setOpenDropdown} />
          </div>
        </nav>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row-reverse lg:relative">
        <main
          className={`text-gray-300 font-open flex-1 p-4 ${
            expandNav ? "lg:ml-36" : "lg:ml-[60px]"
          } transition-all`}
        >
          {children}
        </main>
        <aside
          className={`bg-gray-900 px-2 py-2 flex gap-3 w-screen sticky bottom-0 lg:flex-col lg:py-10 lg:fixed lg:left-0 lg:top-0 ${
            expandNav ? "lg:w-36" : "lg:w-[60px]"
          } lg:transition-all`}
        >
          <ul
            className="flex 
        gap-8 md:gap-14 items-center font-noto justify-center w-full lg:flex-col lg:gap-3 lg:pt-16 lg:items-start"
          >
            {navLinks.map((link) => (
              <li
                key={link.name}
                className={` w-20 items-center group hover:rounded active:bg-orange-700/90  hover:bg-orange-600/90 transition-all overflow-hidden ${
                  link.href === router.pathname
                    ? "bg-orange-600/90 rounded"
                    : "bg-gray-850 rounded-lg"
                } ${
                  expandNav ? "lg:rounded-xl" : "lg:rounded-full"
                } lg:cursor-pointer lg:height-auto lg:hover:rounded-xl lg:transition lg:w-full`}
              >
                <Link
                  href={link.href}
                  className={`p-1 flex flex-col justify-center items-center lg:p-3 lg:justify-start lg:flex-row`}
                >
                  {link.icon(
                    `text-2xl group-hover:text-white transition ${
                      link.href === router.pathname
                        ? "text-white"
                        : "text-orange-500/90"
                    } lg:text-xl`
                  )}
                  <span
                    className={`text-sm group-hover:text-white transition ${
                      link.href === router.pathname
                        ? "text-white"
                        : "text-gray-300"
                    } ${
                      expandNav ? "lg:opacity-100 lg:delay-75" : "lg:opacity-0"
                    } lg:w-0 lg:transition lg:uppercase lg:font-semibold`}
                  >
                    <span className="hidden lg:inline">&nbsp;&nbsp;</span>
                    {link.name}
                  </span>
                </Link>
              </li>
            ))}
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
      </div>
    </div>
  );
};

const ProfileDropdown: React.FC<{ open: boolean; setOpen: any }> = ({
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
      style={{
        ...spring,
        pointerEvents: open ? "all" : "none",
      }}
    >
      <div
        className={
          "outclick fixed h-screen w-full top-0 left-0 -z-10 opacity-0"
        }
        onClick={() => setOpen(false)}
      />
      <div className="flex flex-col gap-2 p-2 z-10">
        <button
          className="p-2 group text-gray-300 hover:bg-blue-600 hover:text-blue-50 flex justify-between items-center transition-colors rounded"
          onClick={() => {
            toast.success("Profile edited successfully");
          }}
        >
          Edit Profile
          <BsFillPencilFill className="inline-block text-xl" />
        </button>
        <hr className="border-gray-800 w-10/12 self-center" />
        <button
          className="p-2 group text-red-500 hover:bg-red-500 hover:text-red-50 flex justify-between items-center transition-colors rounded"
          onClick={() => {
            toast.success("Logged out successfully");
            store.dispatch(logout());
          }}
        >
          Logout
          <MdLogout className="inline-block text-lg" />
        </button>
      </div>
    </a.div>
  );
};

export default Layout;
