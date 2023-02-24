import React from "react";
import { useSpring, a } from "@react-spring/web";
import { useSelector } from "react-redux";
import { storeType } from "../../../../redux/configureStore";
import { Ticket } from "../../../types/models";
import {
  BsFillPersonCheckFill,
  BsFillTrashFill,
  BsPersonDashFill,
  BsPersonPlusFill,
} from "react-icons/bs";
import { OptionsButton } from "../../../components/Button";

interface TicketOptionsPopupProps {
  ticket: Ticket;
  open: boolean;
  setOpen: any;
}

const TicketOptionsPopup: React.FC<TicketOptionsPopupProps> = ({
  ticket,
  open,
  setOpen,
}) => {
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const project = useSelector((store: storeType) => store.project.project!);
  const { loading, method } = useSelector((store: storeType) => store.ticket);

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

  const isInTeam = (model: any) => {
    return !!model.team.filter(
      (member: any) => member._id === currentUser.user?._id
    ).length;
  };

  return (
    <a.div
      className={`ticketOptionsPopup absolute top-3 right-3 w-48 bg-gray-950 shadow-lg shadow-gray-950/40 rounded-md p-2 z-40 isolate`}
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
        {isInTeam(project) && (
          <OptionsButton
            id={`remove-self-${ticket._id}`}
            processing={loading && method.update}
          >
            {isInTeam(ticket) ? (
              <>
                Remove Yourself <BsPersonDashFill />
              </>
            ) : (
              <>
                Assign Yourself <BsPersonPlusFill />
              </>
            )}
          </OptionsButton>
        )}
        {currentUser.user?._id === ticket?.author && (
          <>
            <OptionsButton processing={loading && method.update} color="blue-500">
              Assign Members
              <BsFillPersonCheckFill />
            </OptionsButton>

            <OptionsButton color="red-500">
              Delete Ticket
              <BsFillTrashFill />
            </OptionsButton>
          </>
        )}
      </div>
    </a.div>
  );
};

export default TicketOptionsPopup;
