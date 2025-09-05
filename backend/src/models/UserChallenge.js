import mongoose from "mongoose";
const userChallengeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    challengeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Challenge",
        required: true,
    },
    startedAt:{
        type: Date,
        default: Date.now,
    },
    progress: Number, //progess in days
    completedAt:{
        type: Date,
    },
    rewardClaimed:{
        type: Boolean,
        default: false,
    },
})

const UserChallenge = mongoose.models.UserChallenge || mongoose.model("UserChallenge", userChallengeSchema);
export default UserChallenge;