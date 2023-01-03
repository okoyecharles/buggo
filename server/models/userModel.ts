import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model('User', UserSchema);