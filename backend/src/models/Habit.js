import mongoose from "mongoose";
const habitSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name:{
        type:String,
        required:true,
    },
    emoji:{
        type:String,
    },
    color:{
        type:String,
    },
    category:{
        type:String,
    },
    difficulty:{
        type:String,
        enum: ["easy", "medium", "hard"]
    },
    priority:{
        type:String,
        enum: ["low", "medium", "high"],
    },
    estimatedTime:{
        type:Number, //in minutes
    },
    targetDays:[{
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    }],
    remainderTime:{
        type: String,
    },
    personalMotivation:{
        type: String,
    },
    status:{
        type: String, 
    },
    counters:{
       totalCompletions:{
            type: Number,
            default: 0,
        },
        currStreak:{
            type: Number,
            default: 0,
        },
        longestStreak:{
            type: Number,
            default: 0,
        },
        lastCompleted:{
            type: Date,
        },
    },
},{ timestamps: true })

const Habit = mongoose.models.Habit || mongoose.model("Habit", habitSchema);
export default Habit;