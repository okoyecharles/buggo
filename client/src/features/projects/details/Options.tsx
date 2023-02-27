import { useSpring, a } from "@react-spring/web";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillPersonCheckFill, BsFillTrashFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { storeType } from "../../../../redux/configureStore";
import { Project } from "../../../types/models";

const ProjectDetailsOptionsPopup: React.FC<{
  open: boolean;
  setOpen: any;
  project: Project;
  method: {
    [key: string]: boolean;
  };
  setProjectAssignOpen: any;
  setTicketCreateOpen: any;
  setProjectDeleteOpen: any;
}> = ({
  open,
  setOpen,
  method,
  setProjectAssignOpen,
  setTicketCreateOpen,
  setProjectDeleteOpen,
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
      friction: 25,
    },
  });
  const user = useSelector((store: storeType) => store.currentUser.user);

  return (
    <a.div
      className={`projectDetailOptionsPopup absolute top-[4.5rem] right-2 w-52 bg-gray-950 shadow-lg shadow-gray-950/40 rounded-md p-2 isolate`}
      style={{
        ...spring,
        pointerEvents: open ? "all" : "none",
      }}
    >
      <div
        className={open ? "fixed top-0 left-0 h-screen w-screen -z-10" : ""}
        onClick={() => {
          setOpen(false);
        }}
      />
      <div className="flex flex-col gap-1">
        <button
          className="p-2 group text-gray-300 hover:bg-blue-600 active:bg-blue-700  hover:text-blue-50 flex justify-between items-center transition-colors rounded-sm text-sm disabled:opacity-50"
          disabled={method.update}
          onClick={() => {
            setTicketCreateOpen(true);
          }}
        >
          Create Ticket
          <AiFillPlusCircle className="text-lg" />
        </button>

        <hr className="border-gray-800" />

        <button
          className="p-2 group text-gray-300 hover:bg-blue-600 active:bg-blue-700  hover:text-blue-50 flex justify-between items-center transition-colors rounded-sm text-sm disabled:opacity-50"
          disabled={method.update}
          onClick={() => {
            setProjectAssignOpen(true);
          }}
        >
          Invite Members
          <BsFillPersonCheckFill />
        </button>

        <hr className="border-gray-800" />

        <button
          className="p-2 group text-red-500 hover:bg-red-500 active:bg-red-600 hover:text-red-50 flex justify-between items-center transition-colors rounded-sm text-sm"
          disabled={method.update}
          onClick={() => {
            setProjectDeleteOpen(true);
          }}
        >
          Delete Project
          <BsFillTrashFill />
        </button>
      </div>
    </a.div>
  );
};

export default ProjectDetailsOptionsPopup;
