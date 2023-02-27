import React, { useMemo, useState } from "react";
import { useSpring, a } from "@react-spring/web";
import { useSelector } from "react-redux";
import store, { storeType } from "../../../../redux/configureStore";
import { Ticket } from "../../../types/models";
import {
  BsFillPersonCheckFill,
  BsFillTrashFill,
  BsPersonDashFill,
  BsPersonPlusFill,
} from "react-icons/bs";
import { OptionsButton } from "../../../components/Button";
import { TailSpinLoader } from "../../loader";
import {
  deleteTicket,
  updateTicket,
} from "../../../../redux/actions/ticketActions";
import TicketAssignModal from "../modal/ticketAssign";
import Authorized from "../../../utils/authorization";
import { IoClose } from "react-icons/io5";

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
  const user = useSelector((store: storeType) => store.currentUser.user);
  const project = useSelector((store: storeType) => store.project.project!);
  const { loading, method } = useSelector((store: storeType) => store.ticket);

  const [deleting, setDeleting] = useState<boolean>(false);
  const [closing, setClosing] = useState<boolean>(false);
  const [ticketAssignOpen, setTicketAssignOpen] = useState<boolean>(false);

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
    return model.team.some((member: any) => member._id === user?._id);
  };

  const handleTicketAssign = () => {
    const isInPreviousTeam = isInTeam(ticket);
    const previousTeam = ticket.team.map((member: any) => member._id);

    const newTeam: any = isInPreviousTeam
      ? previousTeam.filter((member) => member !== user?._id!)
      : [...previousTeam, user?._id];

    store.dispatch(
      updateTicket(ticket._id, {
        team: newTeam,
      })
    );

    setOpen(false);
  };

  const isAuthorized = useMemo(() => {
    return Authorized("ticket", "update", user, project, ticket);
  }, [user, project, ticket]);

  return (
    <a.div
      className={`ticketOptionsPopup absolute right-3 top-3 w-48 bg-gray-950 shadow-lg shadow-gray-950/40 rounded-md p-2 z-40 isolate hidden lg:block`}
      style={{
        ...spring,
        pointerEvents: open ? "all" : "none",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={open ? "fixed top-0 left-0 h-screen w-screen -z-10" : ""}
        onClick={() => {
          setOpen(false);
        }}
      />
      <div className="flex flex-col gap-1">
        <OptionsButton
          id={`remove-self-${ticket._id}`}
          processing={loading && method.update}
          onClick={handleTicketAssign}
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
        {isAuthorized ? (
          <>
            <OptionsButton
              processing={loading && method.update}
              color="blue-500"
              onClick={() => {
                setOpen(false);
                setTicketAssignOpen((prev) => !prev);
              }}
            >
              Assign Members
              <BsFillPersonCheckFill />
            </OptionsButton>

            <hr className="border-gray-800" />

            {ticket.status !== "closed" ? (
              <OptionsButton
                processing={loading && method.update}
                color="blue-500"
                onClick={() => {
                  setClosing(true);
                  store.dispatch(
                    updateTicket(ticket._id, { status: "closed" })
                  );
                }}
              >
                Close Ticket
                {loading && method.update && closing ? (
                  <TailSpinLoader height="15" />
                ) : (
                  <IoClose className="text-lg" />
                )}
              </OptionsButton>
            ) : null}

            <OptionsButton
              color="red-500"
              processing={loading && method.delete}
              onClick={() => {
                setDeleting(true);
                store.dispatch(deleteTicket(ticket._id));
              }}
            >
              Delete Ticket
              {loading && method.delete && deleting ? (
                <TailSpinLoader height="15" />
              ) : (
                <BsFillTrashFill />
              )}
            </OptionsButton>
          </>
        ) : null}
      </div>
      <TicketAssignModal
        open={ticketAssignOpen}
        setOpen={setTicketAssignOpen}
        ticket={ticket}
        method={method}
        loading={loading}
      />
    </a.div>
  );
};

export default TicketOptionsPopup;
