import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    blogPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Comment ||
  mongoose.model('Comment', CommentSchema);
