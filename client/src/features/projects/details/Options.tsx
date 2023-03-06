import { useSpring, a } from "@react-spring/web";
import { AiFillPlusCircle } from "react-icons/ai";
import { BsFillPersonCheckFill, BsFillTrashFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { storeType } from "../../../../redux/configureStore";
import { Project } from "../../../types/models";
import { OptionsButton } from "../../../components/Button";
import OptionsPopup from "../../../components/Options";

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
  return (
    <OptionsPopup open={open} setOpen={setOpen} style="top-[5rem] right-2">
      <OptionsButton
        processing={method.update}
        onClick={() => {
          setTicketCreateOpen(true);
        }}
      >
        Create Ticket
        <AiFillPlusCircle className="text-lg" />
      </OptionsButton>

      <hr className="border-gray-800" />

      <OptionsButton
        processing={method.update}
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
        processing={method.update}
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
