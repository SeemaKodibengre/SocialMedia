const mongoose=require('mongoose');
const Schema=mongoose.Schema;



const postSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: String, // Image/Video URL
  description:String,
  type: { type: String, enum: ['image', 'video']},
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track which users liked the post
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
