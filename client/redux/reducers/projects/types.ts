import User from "../user/types";

export type Project = {
  _id: string;
  title: string;
  author: User;
  team: User[];
  tickets: any[];
  createdAt: Date;
};