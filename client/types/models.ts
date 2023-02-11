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
  createdAt: string;
};

export type Ticket = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  time_estimate: number;
  project: string | Project;
  comments: string[] | {}[];
  author: User;
  createdAt: string;
};

export type Comment = {
  _id: string;
  text: string;
  author: User;
  ticket?: Ticket;
  createdAt: string;
};