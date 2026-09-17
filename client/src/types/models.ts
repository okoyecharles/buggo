export type User = {
  _id: string,
  name: string;
  image: string;
  email: string;
  password?: string;
  admin: boolean;
  googleId?: string | undefined;
  createdAt: any;
};


export type Project = {
  _id: string;
  title: string;
  author: User;
  team: User[];
  tickets: any[];
  invitees: any[];
  createdAt: any;
  /**
   * Set by GET /projects on a project the user has only been invited to.
   * Those come back partial (no `team`, `tickets` or `createdAt`), so they
   * feed the invite notification and must be kept out of the project list.
   */
  invitePending?: boolean;
};

export type Ticket = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  time_estimate: number;
  project: Project;
  comments: string[] | {}[];
  team: User[];
  author: any;
  createdAt: any;
};

export type GroupedTickets = {
  _id: string;
  title: string;
  ticketCount: {
    open: number;
    closed: number;
  };
  tickets: Ticket[];
}

export type Comment = {
  _id: string;
  text: string;
  author: User;
  ticket?: Ticket;
  createdAt: any;
};

export enum NotificationType {
	PROJECT_INVITE = "Project Invite",
}

export type Notification = {
  _id: string;
  type: NotificationType;
  date: string;
  /**
   * Keyed by the domain the `type` belongs to: a PROJECT_* notification holds
   * only `{ project }`, a TICKET_* one only `{ ticket }`, and so on. The
   * notification reducer keys off the presence of that field to decide which
   * notifications to drop and recalculate, so a type must not reach outside
   * its own domain here.
   */
  data: Record<string, any>;
};
