import mongoose, { InferSchemaType } from 'mongoose';
import Ticket from './ticketModel';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    invitees: [{
      user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', },
      email: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }],
    tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  },
  {
    timestamps: true,
  }
);

export type ProjectType = InferSchemaType<typeof projectSchema>;

// Delete associated tickets when project is removed from db
projectSchema.pre('remove', { document: true }, async function (next) {
  const project: any = this;
  const tickets = await Ticket.find({ project: project._id });
  tickets.forEach(async (ticket) => {
    await ticket.remove();
  });
  next();
});

// Make sure invitees and team are unique
projectSchema.pre('save', { document: true }, async function (next) {
  const project: ProjectType = this;
  const invitees = project.invitees;
  const uniqueInvitees = invitees.filter(
    (invitee, index) =>
      index === invitees.findIndex((t) => t.user.toString() === invitee.user.toString())
  );

  const team = project.team;
  const uniqueTeam = team.filter(
    (member, index) =>
      index === team.findIndex((t) => t.toString() === member.toString())
  );

  project.invitees = uniqueInvitees;
  project.team = uniqueTeam;
  next();
});

export default mongoose.model('Project', projectSchema);
