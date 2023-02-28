import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import store, { storeType } from "../../redux/configureStore";
import { useSelector } from "react-redux";
import { RiArrowRightSLine } from "react-icons/ri";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";
import ProfileDropdown from "./modal/ProfileDropdown";
import navLinks from "./data/navlinks";
import { restrictLength } from "../utils/components/string";
import EditProfileModal from "./modal/profileEdit";
import defaultAvatar from "../assets/default-avatar";
import { FaBell } from "react-icons/fa";
import NotificationModal from "../features/notifications";
import { useSpring, a } from "@react-spring/web";
import Pusher from "pusher-js";
import { PUSHER_KEY } from "../data/backend-config";
import {
  connectPusher,
  disconnectPusher,
} from "../../redux/actions/pusherActions";
import bindChannelEvents from "./pusher/channel";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const notifications = useSelector(
    (store: storeType) => store.notifications.notifications
  );

  const [openDropdown, setOpenDropdown] = useState(false);
  const [expandNav, setExpandNav] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (
      !currentUser.user &&
      !currentUser.loading &&
      !currentUser.method.validate
    ) {
      router.replace("/login?redirected=true");
    }
  }, [currentUser]);

  // Connect to pusher when user logs in
  useEffect(() => {
    if (currentUser.user?._id && !currentUser.loading) {
      const pusher = new Pusher(PUSHER_KEY, { cluster: "eu" });

      pusher.connection.bind("connected", () => {
        const channel = pusher.subscribe("bug-tracker");
        bindChannelEvents(channel);

        store.dispatch(connectPusher(pusher.connection.socket_id));
      });

      return () => {
        store.dispatch(disconnectPusher());
        pusher.disconnect();
      };
    }
  }, [currentUser.user?._id]);

  const spring = useSpring({
    opacity: notificationOpen ? 0.75 : 1,
    scale: notificationOpen ? 0.95 : 1,
    config: {
      tension: 800,
      friction: 50,
    },
  });

  return (
    <a.div
      className="flex flex-col min-h-screen isolate"
      style={{
        ...spring,
        transformOrigin: "center",
      }}
    >
      <header className="flex flex-col sticky top-0 z-40">
        <nav className="flex items-center shadow-sm shadow-gray-950 bg-gray-800 p-3 text-gray-100 font-open md:px-8 gap-4 h-16">
          <div className="logo font-bold">
            <Link href="/">Bug Tracker</Link>
          </div>
          <button
            className="p-2 notifications ml-auto text-3xl lg:text-4xl text-gray-300 hover:text-gray-200 z-10 cursor-pointer hover:bg-gray-700 rounded-full transition focus:outline-none"
            onClick={() => {
              setNotificationOpen(true);
            }}
          >
            <div className="relative">
              <FaBell className="text-xl" />
              {notifications?.length > 0 && (
                <span className="absolute -top-1/2 -right-1/2 bg-blue-500 text-white w-4 h-4 flex items-center justify-center text-xsm rounded-lg font-semibold ring-4 ring-gray-800">
                  {notifications.length}
                </span>
              )}
            </div>
          </button>
          <div className="profile flex items-center gap-2 relative select-none">
            <Image
              src={currentUser.user?.image || defaultAvatar}
              width="200"
              height="200"
              alt="profile__image"
              className="rounded-full h-8 w-8 object-center object-cover bg-gray-700"
            />
            <div className="profile-name hidden sm:flex flex-col h-fit justify-start">
              <p className="text-sm font-bold">
                {restrictLength(currentUser.user?.name, 20) || "User"}
              </p>
              <p
                className={`text-xsm ${
                  currentUser.user?.admin
                    ? "text-blue-400"
                    : "text-orange-500/90"
                } uppercase font-bold`}
              >
                {currentUser.user?.admin ? "admin" : "dev"}
              </p>
            </div>
            <MdOutlineArrowDropDown
              id="account-toggle"
              role="button"
              name="account toggle"
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
              user={currentUser.user}
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
            <NotificationModal
              open={notificationOpen}
              setOpen={setNotificationOpen}
              user={currentUser.user}
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
          className={`bg-gray-950 border-t lg:border-none border-t-gray-700 px-2 py-1 flex gap-3 w-screen sticky bottom-0 z-50 h-[60px] lg:h-auto lg:z-0 lg:flex-col lg:py-10 lg:fixed lg:left-0 lg:top-0 ${
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
                className={`w-20 items-center rounded-full group lg:active:bg-orange-700/90  lg:hover:bg-orange-600/90 transition-all overflow-hidden ${
                  link.href === router.pathname
                    ? "lg:bg-orange-600/90"
                    : "lg:bg-gray-900"
                } ${
                  expandNav ? "lg:rounded-xl" : "lg:rounded-full"
                } lg:cursor-pointer lg:height-auto lg:hover:rounded-xl lg:transition lg:w-full`}
              >
                <Link
                  href={link.href}
                  className={`p-1 flex flex-col justify-center items-center lg:p-3 lg:justify-start lg:flex-row`}
                >
                  {link.icon({
                    className: `text-2xl group-hover:text-white transition ${
                      link.href === router.pathname
                        ? "text-white"
                        : "text-white lg:text-orange-500/90"
                    } lg:text-xl`,
                    active: link.href === router.pathname,
                  } as any)}
                  <span
                    className={`text-xsm group-hover:text-white transition ${
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
    </a.div>
  );
};

export default Layout;
