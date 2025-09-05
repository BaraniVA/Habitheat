import mongoose from "mongoose";
const moodSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
    mood:{
        type: String,
    },
    energyLevel:{type: Number,},
    stressLevel:{type: Number,},
    note:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now,
    }
})

const Mood = mongoose.models.Mood || mongoose.model("Mood", moodSchema);
export default Mood;