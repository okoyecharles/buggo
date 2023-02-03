import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { storeType } from "../../redux/configureStore";
import { useSelector } from "react-redux";
import { RiArrowRightSLine } from "react-icons/ri";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";
import ProfileDropdown from "./ProfileDropdown";
import navLinks from "./data/navigation";
import { restrictLength } from "../../utils/stringHelper";
import EditProfileModal from "./profileEdit";
import defaultAvatar from "../../db/avatar/default";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [expandNav, setExpandNav] = useState(false);
  const [editProfile, setEditProfile] = useState(false);

  useEffect(() => {
    if (
      !currentUser.user &&
      !currentUser.loading &&
      !currentUser.method.validate
    ) {
      router.replace("/login?redirected=true");
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col min-h-screen isolate">
      <header className="flex flex-col sticky top-0 z-40">
        <nav className="flex items-center shadow-sm shadow-gray-950 bg-gray-800 justify-between p-3 text-gray-100 font-open md:px-8">
          <div className="logo font-bold">
            <Link href="/">Bug Tracker</Link>
          </div>
          <div className="profile flex items-center gap-2 relative select-none">
            <Image
              src={currentUser.user?.image || defaultAvatar}
              width="200"
              height="200"
              alt="profile__image"
              className="rounded-full h-10 w-10 object-center object-cover bg-gray-700"
            />
            <div className="profile-info flex flex-col h-full justify-start">
              <p className="text-sm font-bold">
                {restrictLength(currentUser.user?.name, 20) || "User"}
              </p>
              <p
                className={`text-xsm ${
                  currentUser.user?.admin
                    ? "text-blue-500/90"
                    : "text-orange-500/90"
                } uppercase font-bold`}
              >
                {currentUser.user?.admin ? "admin" : "dev"}
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
            <ProfileDropdown
              open={openDropdown}
              setOpen={setOpenDropdown}
              setEditProfile={setEditProfile}
            />
            <EditProfileModal
              open={editProfile}
              setOpen={setEditProfile}
              user={currentUser.user}
              loading={currentUser.loading}
              method={currentUser.method}
            />
          </div>
        </nav>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row-reverse lg:relative">
        <main
          className={`text-gray-300 font-open flex-1 ${
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

export default Layout;
