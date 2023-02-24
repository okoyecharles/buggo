import { useSpring, a } from "@react-spring/web";
import { BsFillPencilFill } from "react-icons/bs";
import { logout } from "../../../redux/actions/userActions";
import store, { storeType } from "../../../redux/configureStore";
import { MdLogout } from "react-icons/md";
import { User } from "../../types/models";
import { useSelector } from "react-redux";

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
  const currentUser = useSelector((store: storeType) => store.currentUser.user);

  return (
    <a.div
      className="absolute top-[calc(100%+1rem)] right-1 w-48 bg-gray-950 shadow-lg shadow-gray-950/50 rounded-md select-none isolate"
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
      <div className="flex flex-col gap-2 p-2 z-10 text-ss">
        <header className="px-2 text-sm text-gray-400">
          <h2>Signed in as</h2>
          <h3 className={
            `font-semibold font-noto truncate ${
              (currentUser?.admin || false) === true ? "text-blue-400/90" : "text-orange-400/90"
            }`
          }>
            {user?.name || 'User'}
          </h3>
          <h3 className="text-gray-500 text-xsm font-noto truncate">
            {user?.email || 'user@gmail.com'}
          </h3>
        </header>
        <hr className="border-gray-800 w-11/12 self-center" />
        <button
          className="p-2 group text-gray-300 hover:bg-blue-600 hover:text-blue-50 flex justify-between items-center transition-colors rounded-sm"
          onClick={() => {
            setEditProfile(true);
            setOpen(false);
          }}
        >
          Edit Profile
          <BsFillPencilFill className="inline-block" />
        </button>
        <hr className="border-gray-800 w-11/12 self-center" />
        <button
          className="p-2 group text-red-500 hover:bg-red-500 hover:text-red-50 flex justify-between items-center transition-colors rounded-sm"
          onClick={() => {
            store.dispatch(logout());
            setOpen(false);
          }}
        >
          Logout
          <MdLogout className="inline-block text-lg" />
        </button>
      </div>
    </a.div>
  );
};

export default ProfileDropdown;
