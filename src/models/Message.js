// import mongoose from "mongoose";

// const MessageSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   text: {
//     type: String,
//     required: true,
//   },
//   isRead: {
//     type: Boolean,
//     default: false,
//   },
 
// }, { timestamps: true });

// export default mongoose.models.Message || mongoose.model("Message", MessageSchema);


import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isImportant: {
    type: Boolean,
    default: false,
  },
  isAutoReply: {
    type: Boolean,
    default: false,
  },
  isSystemMessage: {
    type: Boolean,
    default: false,
  },
  replyType: {
    type: String,
    enum: ['human', 'ai_offline', 'ai_cooldown', 'none'],
    default: 'none'
  }
}, { timestamps: true });

// Index for better query performance
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
MessageSchema.index({ isRead: 1, receiver: 1 });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);