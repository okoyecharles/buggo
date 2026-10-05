import React from "react";
import {
  BsFillPencilFill,
  BsFillPersonCheckFill,
  BsFillTrashFill,
} from "react-icons/bs";
import { OptionsButton } from "@/core/components/button";
import OptionsPopup from "@/core/components/options";
import { useSelector } from "react-redux";
import { storeType } from "@/redux/configureStore";

const ProjectOptionsPopup: React.FC<{
  open: boolean;
  setOpen: any;
  setProjectDeleteConfirm: any;
  handleEditMode: any;
  setProjectAssign: any;
}> = ({
  open,
  setOpen,
  handleEditMode,
  setProjectDeleteConfirm,
  setProjectAssign,
}) => {
  const pending = useSelector((store: storeType) => store.projects.pending);

  return (
    <OptionsPopup open={open} setOpen={setOpen}>
      <OptionsButton
        processing={pending.update}
        onClick={() => {
          setOpen(false);
          handleEditMode();
        }}
      >
        Edit Project
        <BsFillPencilFill />
      </OptionsButton>

      <OptionsButton
        processing={pending.update}
        onClick={() => {
          setProjectAssign(true);
          setOpen(false);
        }}
      >
        Invite Members
        <BsFillPersonCheckFill />
      </OptionsButton>

      <hr className="border-gray-800" />

      <OptionsButton
        color="red-500"
        processing={pending.delete}
        onClick={() => setProjectDeleteConfirm(true)}
      >
        Delete Project
        <BsFillTrashFill />
      </OptionsButton>
    </OptionsPopup>
  );
};

export default ProjectOptionsPopup;
