import React from "react";
import { useSpring, a } from "@react-spring/web";
import {
  BsFillPencilFill,
  BsFillPersonCheckFill,
  BsFillTrashFill,
} from "react-icons/bs";

const ProjectOptionsPopup: React.FC<{
  open: boolean;
  loading: boolean;
  method: any;
  setOpen: any;
  setProjectDeleteConfirm: any;
  handleEditMode: any;
  setProjectAssign: any;
}> = ({
  open,
  loading,
  method,
  setOpen,
  handleEditMode,
  setProjectDeleteConfirm,
  setProjectAssign,
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
          className="p-2 group text-gray-300 hover:bg-blue-600 active:bg-blue-700  hover:text-blue-50 flex justify-between items-center transition-colors rounded-sm text-sm disabled:opacity-50"
          disabled={loading && method.update}
          onClick={() => {
            setProjectAssign(true);
            setOpen(false);
          }}
        >
          Invite Members
          <BsFillPersonCheckFill />
        </button>

        <hr className="border-gray-800" />

        <button
          className="p-2 group text-red-500 hover:bg-red-500 active:bg-red-600 hover:text-red-50 flex justify-between items-center transition-colors rounded-sm text-sm"
          onClick={() => setProjectDeleteConfirm(true)}
        >
          Delete Project
          <BsFillTrashFill />
        </button>
      </div>
    </a.div>
  );
};

export default ProjectOptionsPopup;
