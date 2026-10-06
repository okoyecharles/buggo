import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillPersonCheckFill, BsFillTrashFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { storeType } from "@/redux/configureStore";
import { Project } from "@/core/types/models";
import { OptionsButton } from "@/core/components/button";
import OptionsPopup from "@/core/components/options";

const ProjectDetailsOptionsPopup: React.FC<{
  open: boolean;
  setOpen: any;
  project: Project;
  ticketCreateOpen: boolean;
  projectAssignOpen: boolean;
  projectDeleteOpen: boolean;
  setProjectAssignOpen: any;
  setTicketCreateOpen: any;
  setProjectDeleteOpen: any;
}> = ({
  open,
  setOpen,
  ticketCreateOpen,
  projectAssignOpen,
  projectDeleteOpen,
  setProjectAssignOpen,
  setTicketCreateOpen,
  setProjectDeleteOpen,
	project,
}) => {
  const pending = useSelector((store: storeType) => store.project.pending);

  return (
    <OptionsPopup id={`project-details-options-${project._id}`} open={open} setOpen={setOpen} style="top-[5rem] right-2">
      <OptionsButton
				ariaLabel={`Create ticket in ${project.title}`}
        ariaExpanded={ticketCreateOpen}
        ariaControls="create-ticket-modal"
        processing={pending.createTicket}
        onClick={() => {
          setTicketCreateOpen(true);
        }}
      >
        Create Ticket
        <AiFillPlusCircle className="text-lg" />
      </OptionsButton>

      <hr className="border-gray-800" />

      <OptionsButton
        processing={pending.update}
				ariaLabel={`Invite members to ${project.title}`}
        ariaExpanded={projectAssignOpen}
        ariaControls={`invite-project-modal-${project._id}`}
        onClick={() => {
          setProjectAssignOpen(true);
        }}
      >
        Invite Members
        <BsFillPersonCheckFill />
      </OptionsButton>

      <hr className="border-gray-800" />

      <OptionsButton
        color="red-500"
				ariaLabel={`Delete ${project.title}`}
        ariaExpanded={projectDeleteOpen}
        ariaControls={`delete-project-modal-${project._id}`}
        processing={pending.delete}
        onClick={() => {
          setProjectDeleteOpen(true);
        }}
      >
        Delete Project
        <BsFillTrashFill />
      </OptionsButton>
    </OptionsPopup>
  );
};

export default ProjectDetailsOptionsPopup;
