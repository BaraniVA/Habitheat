import mongoose from "mongoose";

const StageSchema = new mongoose.Schema({
  stage: { type: Number, required: true },
  target: { type: Number, required: true },
  reward: { type: String }
}, { _id: false });

const achievementSchema = new mongoose.Schema({
    title: String,
    description: String,
    badgeImage: String,
    stages: {
      type: [StageSchema],
      required: true
    },
},{ timestamps: true })

const Achievement = mongoose.models.Achievement || mongoose.model("Achievement", achievementSchema);
export default Achievement;