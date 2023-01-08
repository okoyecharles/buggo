import mongoose, { InferSchemaType } from "mongoose";
import Ticket from "./ticketModel";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }]
}, {
  timestamps: true
});

export type ProjectType = InferSchemaType<typeof projectSchema>;


// Delete associated tickets when project is removed from db
projectSchema.pre("remove", { document: true }, async function (next) {
  const project: any = this;
  console.log('Deleting associated tickets... for project: ', project.title);
  await Ticket.deleteMany({ project: project._id });
  next();
});

projectSchema.pre("deleteMany", async function (next) {
  const project: any = this;
  console.log('Deleting associated tickets... for project: ', this.getQuery());
  await Ticket.deleteMany({ project: project._id });
  next();
});


export default mongoose.model('Project', projectSchema);