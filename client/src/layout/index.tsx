import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import store, { storeType } from "../../redux/configureStore";
import { useSelector } from "react-redux";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";
import ProfileDropdown from "./modal/ProfileDropdown";
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
import SideBar from "./sidebar";

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
            <Link href="/" className="flex items-center gap-2">
              <Image src={'/text-logo.png'} height={22} width={100} alt="buggo"/>
            </Link>
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
        <SideBar expandNav={expandNav} setExpandNav={setExpandNav} />
      </div>
    </a.div>
  );
};

export default Layout;
