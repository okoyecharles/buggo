import mongoose, { InferSchemaType } from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
})

export type CommentType = InferSchemaType<typeof commentSchema>;
export default mongoose.model('Comment', commentSchema);