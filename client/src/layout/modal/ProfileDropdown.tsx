import { useSpring, a } from "@react-spring/web";
import { BsFillPencilFill } from "react-icons/bs";
import { logout } from "../../../redux/actions/userActions";
import store from "../../../redux/configureStore";
import { MdLogout } from "react-icons/md";
import { User } from "../../types/models";
import OptionsPopup from "../../components/Options";
import { OptionsButton } from "../../components/Button";

const ProfileDropdown: React.FC<{
  open: boolean;
  setOpen: any;
  setEditProfile: any;
  user: User | null;
}> = ({ open, setOpen, setEditProfile, user }) => {
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

  // top-[calc(100%+1rem)] right-1

  return (
    <OptionsPopup
      open={open}
      setOpen={setOpen}
      style="top-[4rem] right-0"
    >
      <header className="px-2 text-sm text-gray-400 mb-2">
        <h2>Signed in as</h2>
        <h3
          className={`font-semibold font-noto truncate ${
            (user?.admin || false) === true
              ? "text-blue-400/90"
              : "text-orange-400/90"
          }`}
        >
          {user?.name || "User"}
        </h3>
        <h3 className="text-gray-500 text-xsm font-noto truncate">
          {user?.email || "user@gmail.com"}
        </h3>
      </header>

      <OptionsButton
        onClick={() => {
          setEditProfile(true);
          setOpen(false);
        }}
      >
        Edit Profile
        <BsFillPencilFill className="inline-block" />
      </OptionsButton>

      <hr className="border-gray-800" />

      <OptionsButton
        color="red-500"
        onClick={() => {
          store.dispatch(logout());
          setOpen(false);
        }}
      >
        Logout
        <MdLogout className="inline-block text-lg" />
      </OptionsButton>
    </OptionsPopup>
  );
};

export default ProfileDropdown;
