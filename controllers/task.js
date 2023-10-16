import Task from "../models/Task.js";
import User from "../models/User.js";


export const createTask = async (req, res, next) => {
    try {
        const newTask = new Task({
            colab: req.body.colab ?? 0,
            user_id: req.body.user_id,
            colab_user_id: req.body.colab_user_id ?? null
        });

        const savedTask = await newTask.save();
        try {
            const user = await User.findById(newTask.user_id);
            await User.findByIdAndUpdate(user._id, { $push: { task: savedTask._id } });
        } catch (error) {
            next(error);
        }

        res.status(200).send('Task has been created.');
    } catch (error) {
        next(error);
    }
}

export const getAllUserTask = async (req, res, next) => {
    try {
        const user = "652297a27574c771f589e594";
        const query = { user_id: user };
        const countTask = await Task.countDocuments(query);
        res.status(200).json({ total_task: countTask });
    } catch (error) {
        next(error);
    }
}
