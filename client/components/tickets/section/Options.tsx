import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import store, { storeType } from "@/redux/configureStore";
import { Ticket } from "@/core/types/models";
import {
  BsFillPersonCheckFill,
  BsFillTrashFill,
  BsPersonDashFill,
  BsPersonPlusFill,
} from "react-icons/bs";
import { OptionsButton } from "@/core/components/button";
import { TailSpinLoader } from "@/core/components/loader";
import { updateTicket } from "@/redux/actions/ticketActions";
import TicketAssignModal from "@/components/tickets/modal/ticketAssign";
import getAuthorization from "@/core/utils/authorization";
import { IoClose } from "react-icons/io5";
import TicketDeleteModal from "@/components/tickets/modal/ticketDelete";
import OptionsPopup from "@/core/components/options";
import {
  ticketStatus,
  validateTicketTeam,
} from "@/core/utils/validation/ticket";
import { toast } from "react-toastify";

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
  const updating = useSelector((store: storeType) => store.ticket.pending.update);

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

    const teamValidationError = validateTicketTeam(newTeam);
    if (teamValidationError) {
      toast.error(teamValidationError);
      return;
    }

    store.dispatch(
      updateTicket(ticket._id, {
        team: newTeam,
      })
    );

    setOpen(false);
  };

  const isAuthorized = useMemo(() => {
    return getAuthorization("ticket", "update", user, project, ticket);
  }, [user, project, ticket]);

  return (
    <>
      <OptionsPopup open={open} setOpen={setOpen} style="hidden lg:block">
        {isAuthorized ? (
          <>
            <OptionsButton
              id={`remove-self-${ticket._id}`}
              processing={updating}
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

            <OptionsButton
              processing={updating}
              onClick={() => {
                setOpen(false);
                setTicketAssignOpen((prev) => !prev);
              }}
            >
              Assign Members
              <BsFillPersonCheckFill />
            </OptionsButton>

            <hr className="border-gray-800" />

            {ticket.status !== ticketStatus.closed ? (
              <OptionsButton
                processing={updating}
                onClick={async () => {
                  setClosing(true);
                  await store.dispatch(
                    updateTicket(ticket._id, { status: ticketStatus.closed })
                  );
                  setClosing(false);
                }}
              >
                Close Ticket
                {updating && closing ? (
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
      />
      <TicketDeleteModal
        open={deleteTicketOpen}
        setOpen={setDeleteTicketOpen}
        ticket={ticket}
      />
    </>
  );
};

export default TicketOptionsPopup;
