import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  title:{
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  icon:{
    type: String,
  },
  durationDays: Number,
  rewardBadge: String,
  requirements: Object
})
const Challenge = mongoose.models.Challenge || mongoose.model("Challenge", challengeSchema);
export default Challenge;