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
import { Project } from "@/core/types/models";

const ProjectOptionsPopup: React.FC<{
  open: boolean;
  setOpen: any;
  projectDeleteConfirm: boolean;
  projectInvite: boolean;
  setProjectDeleteConfirm: any;
  handleEditMode: any;
  setProjectAssign: any;
	project: Project;
}> = ({
  open,
  setOpen,
  handleEditMode,
  projectDeleteConfirm,
  projectInvite,
  setProjectDeleteConfirm,
  setProjectAssign,
	project,
}) => {
  const pending = useSelector((store: storeType) => store.projects.pending);

  return (
    <OptionsPopup id={`project-options-${project._id}`} open={open} setOpen={setOpen}>
      <OptionsButton
				ariaLabel={`Edit project: ${project.title}`}
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
				ariaLabel={`Invite members to project: ${project.title}`}
        ariaExpanded={projectInvite}
        ariaControls={`invite-project-modal-${project._id}`}
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
				ariaLabel={`Delete project: ${project.title}`}
        ariaExpanded={projectDeleteConfirm}
        ariaControls={`delete-project-modal-${project._id}`}
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
