// This controller manages all actions related to user authorization
// It will be used to check if the user is authorized to perform certain actions

import { Project, Ticket, User } from "../../types/models";

const Authorized = (
  modelName: "project" | "ticket" | "comment" | "user",
  action: "create" | "update" | "delete",
  user: User | null,
  project?: Project | null,
  ticket?: Ticket | null,
  comment?: Comment | null
): boolean => {
  if (!user) return false;

  switch (modelName) {
    case "project":
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
    case "ticket":
      if (!ticket) return false;
      switch (action) {
        case "create":
          return true;
        case "update": {
          return (
            user._id === ticket.author._id || user._id === project?.author._id
          );
        }
        case "delete":
          return (
            user._id === ticket.author._id || user._id === project?.author._id
          );
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
    case "user":
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
