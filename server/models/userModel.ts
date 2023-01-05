import mongoose, { InferSchemaType } from 'mongoose';

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
export default mongoose.model('User', UserSchema);
