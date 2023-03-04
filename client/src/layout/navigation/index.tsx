import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBell } from "react-icons/fa";
import { useSelector } from "react-redux";
import { storeType } from "../../../redux/configureStore";
import defaultAvatar from "../../assets/default-avatar";
import { restrictLength } from "../../utils/components/string";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import ProfileDropdown from "../modal/ProfileDropdown";
import EditProfileModal from "../modal/profileEdit";
import NotificationModal from "../../features/notifications";

interface NavigationProps {
  notificationOpen: boolean;
  setNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navigation: React.FC<NavigationProps> = ({
  notificationOpen,
  setNotificationOpen,
}) => {
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const notifications = useSelector(
    (store: storeType) => store.notifications.notifications
  );

  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [editProfile, setEditProfile] = React.useState(false);

  return (
    <header className="flex flex-col fixed w-full top-0 z-40">
      <nav className="flex items-center shadow-sm shadow-gray-950 bg-gray-800 p-3 text-gray-100 font-open md:px-8 gap-4 h-16">
        <div className="logo font-bold">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src={"/text-logo.png"} height={20} width={100} alt="buggo" />
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
                currentUser.user?.admin ? "text-blue-400" : "text-orange-500/90"
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
  );
};

export default Navigation;
