import mongoose, { InferSchemaType } from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    googleId: { type: String, required: false },
    admin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export type UserType = InferSchemaType<typeof UserSchema>;
export default mongoose.model('User', UserSchema);
