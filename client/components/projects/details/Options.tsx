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
  setProjectAssignOpen: any;
  setTicketCreateOpen: any;
  setProjectDeleteOpen: any;
}> = ({
  open,
  setOpen,
  setProjectAssignOpen,
  setTicketCreateOpen,
  setProjectDeleteOpen,
	project,
}) => {
  const pending = useSelector((store: storeType) => store.project.pending);

  return (
    <OptionsPopup open={open} setOpen={setOpen} style="top-[5rem] right-2">
      <OptionsButton
				ariaLabel={`Create ticket in ${project.title}`}
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
