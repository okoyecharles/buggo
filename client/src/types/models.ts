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
  PROJECT_INVITE = "PROJECT_INVITE",
}

type BaseNotification = {
  _id: string;
  recipient: string;
  read: boolean;
  createdAt: string;
};

/*
 * `snapshot` is what to display, captured when the notification was written,
 * so it never dangles. Each type owns its own shape, keyed by the domain the
 * type belongs to. Ids are real, so an action still knows what to act on.
 */
export type ProjectInviteNotification = BaseNotification & {
  type: NotificationType.PROJECT_INVITE;
  snapshot: {
    project: { _id: string; title: string };
    actor: { _id: string; name: string };
  };
};

export type Notification = ProjectInviteNotification;
