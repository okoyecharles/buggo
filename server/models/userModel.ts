import mongoose, { InferSchemaType } from 'mongoose';
import Project from './projectModel';
import Ticket from './ticketModel';
import Comment from './commentModel';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, min: 2, max: 50 },
    image: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, min: 6 },
    googleId: { type: String, required: false },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export type UserType = InferSchemaType<typeof UserSchema>;

// Delete associated projects and tickets when user is removed from db
UserSchema.pre('remove', { document: true }, async function (next) {
  const user: any = this;

  await Project.deleteMany({ author: user._id });
  await Ticket.deleteMany({ author: user._id });
  await Comment.deleteMany({ author: user._id });

  next();
});

export default mongoose.model('User', UserSchema);
