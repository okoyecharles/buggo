type Ticket = {
  _id: string;
  title: string;
  description: string; 
  status: string;
  priority: string;
  type: string;
  time_estimate: number;
  project: string;
  comments: string[] | {}[];
  createdAt: string;
};

export default Ticket;