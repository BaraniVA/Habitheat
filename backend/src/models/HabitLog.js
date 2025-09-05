import mongoose from "mongoose";
const habitLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Habit",
        required: true,
      },
    date: {
        type: Date,
        required: true,
      },
    status: {
        type: String,
        enum: ["completed", "missed", "skipped"],
        required: true,
      },
    completionTime: {
        type: Number,
        required: true,
      },
    notes: {
        type: String,
      },
})

const HabitLog = mongoose.models.HabitLog || mongoose.model("HabitLog", habitLogSchema);
export default HabitLog;