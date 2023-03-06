import React from "react";
import {
  BsFillPencilFill,
  BsFillPersonCheckFill,
  BsFillTrashFill,
} from "react-icons/bs";
import { OptionsButton } from "../../../components/Button";
import OptionsPopup from "../../../components/Options";

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
  return (
    <OptionsPopup open={open} setOpen={setOpen}>
      <OptionsButton
        processing={loading && method.update}
        onClick={() => {
          setOpen(false);
          handleEditMode();
        }}
      >
        Edit Project
        <BsFillPencilFill />
      </OptionsButton>

      <OptionsButton
        processing={loading && method.update}
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
        processing={loading && method.delete}
        onClick={() => setProjectDeleteConfirm(true)}
      >
        Delete Project
        <BsFillTrashFill />
      </OptionsButton>
    </OptionsPopup>
  );
};

export default ProjectOptionsPopup;
