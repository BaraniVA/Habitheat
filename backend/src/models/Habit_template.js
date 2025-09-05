import mongoose from "mongoose";
const habitTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    emoji: {
        type: String,
        required: true,
    },
    color: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },
    priority: {
        type: Number,
        enum: ["low", "medium", "high"],
        required: true,
    },
    estimatedTime: {
        type: Number,
        required: true,
    },
    targetDays: {
        type: [Number],
        required: true,
    },
    personalMotivation: {
        type: String,
        required: true,
    },
})

const HabitTemplate = mongoose.models.HabitTemplate || mongoose.model("HabitTemplate", habitTemplateSchema);
export default HabitTemplate;