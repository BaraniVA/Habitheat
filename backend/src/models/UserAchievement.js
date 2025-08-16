import mongoose from "mongoose";

const UnlockedStageSchema = new mongoose.Schema({
  stage: { type: Number, required: true },
  unlockedAt: { type: Date, default: Date.now }
}, { _id: false });

const userAchievementSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    achievementId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement",
        required: true,
    },
    currentStage:{
        type: Number,
        default: 0,
    },
    unlockedStages: {
        type: [UnlockedStageSchema],
        default: [],
    },
    isCompleted:{
        type: Boolean,
        default: false,
    },
    lastUpdatedAt:{
        type: Date,
    }
})

const UserAchievement = mongoose.models.UserAchievement || mongoose.model("UserAchievement", userAchievementSchema);
export default UserAchievement;