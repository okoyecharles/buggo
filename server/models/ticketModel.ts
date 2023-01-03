import mongoose, { InferSchemaType } from 'mongoose';

// Status: New | Open | In Progress | Resolved | Closed
// Priority: Immediate | High | Medium | Low
// Type: Issue | Bug | Error | Feature Request | Other

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  type: { type: String, required: true },
  time_estimate: { type: Number, required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, {
  timestamps: true
});

export type TicketType = InferSchemaType<typeof ticketSchema>;
export default mongoose.model('Ticket', ticketSchema);