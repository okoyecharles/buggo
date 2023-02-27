// This controller manages all actions related to user authorization
// It will be used to check if the user is authorized to perform certain actions

import { Project, Ticket, User } from "../../types/models";

const Authorized = (
  modelName: "project" | "ticket" | "comment",
  action: "create" | "update" | "delete" | "team" | "ticket-create",
  user: User | null,
  project?: Project | null,
  ticket?: Ticket | null,
  comment?: Comment | null
): boolean => {
  if (!user) return false;

  switch (modelName) {
    case "project":
      if (!project) return false;
      switch (action) {
        case "update":
          return project.author._id === user._id;
        case "delete":
          return project.author._id === user._id;
        case "team":
          return project.team.some((member) => member._id === user._id);
        case "ticket-create":
          return project.team.some((member) => member._id === user._id);
        default:
          return false;
      }
    case "ticket":
      if (!ticket) return false;
      const ticketAuthor =
        typeof ticket.author === "string" ? ticket.author : ticket.author._id;

      switch (action) {
        case "update": {
          return user._id === ticketAuthor || user._id === project?.author._id;
        }
        case "delete":
          return user._id === ticketAuthor || user._id === project?.author._id;
        default:
          return false;
      }
    case "comment":
      switch (action) {
        case "create":
          return true;
        case "update":
          return true;
        case "delete":
          return true;
        default:
          return false;
      }
    default:
      return false;
  }
};

export default Authorized;
