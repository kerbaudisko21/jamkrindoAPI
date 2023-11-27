import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    colab: {
        type: Number,
    },
    file: {
        type: String,
    },
    user_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    colab_user_id: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    ],
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema)