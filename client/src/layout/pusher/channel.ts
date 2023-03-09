import { Channel } from "pusher-js";
import store from "../../../redux/configureStore";
import { pusherCreateProject, pusherDeleteProject, pusherUpdateProject } from "../../../redux/actions/projectActions";
import { pusherCommentOnTicket, pusherCreateTicket, pusherDeleteTicket, pusherUpdateTicket } from "../../../redux/actions/ticketActions";
import { pusherDeleteUser } from "../../../redux/actions/userActions";

const bindChannelEvents = (channel: Channel) => {
  // Project create
  channel?.bind(
    "project-create",
    ({ projectId }: { projectId: string }) => {
      store.dispatch(pusherCreateProject(projectId));
    }
  );

  // Project update
  channel?.bind(
    "project-update",
    ({ projectId }: { projectId: string }) => {
      store.dispatch(pusherUpdateProject(projectId));
    }
  );

  // Project delete
  channel?.bind(
    "delete-project",
    ({ projectId }: { projectId: string }) => {
      store.dispatch(pusherDeleteProject(projectId));
    }
  );

  // Project invite
  channel?.bind(
    "project-invite",
    ({ projectId }: { projectId: string }) => {
      store.dispatch(pusherUpdateProject(projectId));
    }
  );

  // Accept project invite
  channel?.bind(
    "accept-project-invite",
    ({ projectId }: { projectId: string }) => {
      store.dispatch(pusherUpdateProject(projectId));
    }
  );

  // Comment on ticket
  channel?.bind(
    "new-ticket-comment",
    ({ ticketId, comment }: { ticketId: string; comment: any }) => {
      store.dispatch(pusherCommentOnTicket(ticketId, comment._id));
    }
  );

  // Create ticket
  channel?.bind(
    "create-project-ticket",
    ({ ticket }: { ticket: any }) => {
      store.dispatch(pusherCreateTicket(ticket._id));
    }
  );

  // Update ticket
  channel?.bind(
    "update-project-ticket",
    ({ ticket }: { ticket: any }) => {
      store.dispatch(pusherUpdateTicket(ticket._id));
    }
  );

  // Delete ticket
  channel?.bind(
    "delete-project-ticket",
    ({ ticket }: { ticket: any }) => {
      store.dispatch(pusherDeleteTicket(ticket._id));
    }
  );

  // Delete User
  channel?.bind(
    "delete-user",
    ({ userId }: { userId: string }) => {
      pusherDeleteUser(userId);
    }
  );
}

export default bindChannelEvents;