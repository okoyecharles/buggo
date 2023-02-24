export type User = {
  _id: string,
  name: string;
  image: string;
  email: string;
  password?: string;
  admin: boolean;
  googleId?: string | undefined;
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

export type Notification = {
  _id: string;
  type: string;
  subject: string;
  date: any;
  ref: {
    [key: string]: any;
  };
};