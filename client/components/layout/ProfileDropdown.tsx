import { useSpring, a } from "@react-spring/web";
import { BsFillPencilFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { logout } from "../../redux/actions/userActions";
import store from "../../redux/configureStore";
import { MdLogout } from "react-icons/md";

const ProfileDropdown: React.FC<{
  open: boolean;
  setOpen: any;
  setEditProfile: any;
}> = ({ open, setOpen, setEditProfile }) => {
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

export default ProfileDropdown;
