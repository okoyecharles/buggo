import { useSelector } from "react-redux";
import { Project } from "../../../../../redux/reducers/projects/types";
import { storeType } from "../../../../../redux/configureStore";
import { useSpring, a } from "@react-spring/web";
import { BsFillPencilFill, BsFillPersonCheckFill, BsFillTrashFill, BsPersonDashFill, BsPersonPlusFill } from "react-icons/bs";

const ProjectOptionsPopup: React.FC<{
  open: boolean;
  project: Project;
  loading: boolean;
  method: any;
  setOpen: any;
  setProjectDeleteConfirm: any;
  handleEditMode: any;
  handleAssign: any;
  setProjectAssign: any;
  pos: number;
}> = ({
  open,
  project,
  loading,
  method,
  setOpen,
  handleAssign,
  pos,
  handleEditMode,
  setProjectDeleteConfirm,
  setProjectAssign,
}) => {
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const isInTeam = (project: any) => {
    return !!project.team.filter(
      (member: any) => member._id === currentUser.user?._id
    ).length;
  };

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

  return (
    <a.div
      className={`projectOptionsPopup absolute top-4 right-4 w-48 bg-gray-950 shadow-lg shadow-gray-950/40 rounded-md p-2 z-40 isolate`}
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
          id={`remove-self-${project._id}`}
          className="p-2 group text-gray-300 hover:bg-blue-600 active:bg-blue-700  hover:text-blue-50 flex justify-between items-center transition-colors rounded-sm text-sm disabled:opacity-50"
          onClick={() => {
            handleAssign();
            setOpen(false);
          }}
          disabled={loading && method.update}
        >
          {isInTeam(project) ? (
            <>
              Remove Yourself <BsPersonDashFill />
            </>
          ) : (
            <>
              Assign Yourself <BsPersonPlusFill />
            </>
          )}
        </button>
        {currentUser.user?._id === project.author._id && (
          <>
            <button
              className="p-2 group text-gray-300 hover:bg-blue-600 active:bg-blue-700  hover:text-blue-50 flex justify-between items-center transition-colors rounded-sm text-sm disabled:opacity-50"
              disabled={loading && method.update}
              onClick={() => {
                setProjectAssign(true);
                setOpen(false);
              }}
            >
              Assign Members
              <BsFillPersonCheckFill />
            </button>

            <button
              className="p-2 group text-gray-300 hover:bg-blue-600 active:bg-blue-700 hover:text-blue-50 flex justify-between items-center transition-colors rounded-sm text-sm disabled:opacity-50"
              disabled={loading && method.update}
              onClick={() => {
                setOpen(false);
                handleEditMode();
              }}
            >
              Edit Project
              <BsFillPencilFill />
            </button>

            <button
              className="p-2 group text-red-500 hover:bg-red-500 active:bg-red-600 hover:text-red-50 flex justify-between items-center transition-colors rounded-sm text-sm"
              onClick={() => setProjectDeleteConfirm(true)}
            >
              Delete Project
              <BsFillTrashFill />
            </button>
          </>
        )}
      </div>
    </a.div>
  );
};

export default ProjectOptionsPopup;