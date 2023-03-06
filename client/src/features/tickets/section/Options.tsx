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
import { updateTicket } from "../../../../redux/actions/ticketActions";
import TicketAssignModal from "../modal/ticketAssign";
import Authorized from "../../../utils/authorization";
import { IoClose } from "react-icons/io5";
import TicketDeleteModal from "../modal/ticketDelete";
import OptionsPopup from "../../../components/Options";

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

  const [closing, setClosing] = useState<boolean>(false);
  const [ticketAssignOpen, setTicketAssignOpen] = useState<boolean>(false);
  const [deleteTicketOpen, setDeleteTicketOpen] = useState<boolean>(false);

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
    <>
      <OptionsPopup open={open} setOpen={setOpen}>
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
              onClick={() => {
                setDeleteTicketOpen(true);
                setOpen(false);
              }}
            >
              Delete Ticket
              <BsFillTrashFill />
            </OptionsButton>
          </>
        ) : null}
      </OptionsPopup>
      <TicketAssignModal
        open={ticketAssignOpen}
        setOpen={setTicketAssignOpen}
        ticket={ticket}
        method={method}
        loading={loading}
      />
      <TicketDeleteModal
        open={deleteTicketOpen}
        setOpen={setDeleteTicketOpen}
        ticket={ticket}
        method={method}
        loading={loading}
      />
    </>
  );
};

export default TicketOptionsPopup;
