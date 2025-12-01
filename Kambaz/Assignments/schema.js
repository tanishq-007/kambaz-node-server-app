import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        title: { type: String, required: true },
        description: String,
        points: { type: Number, default: 100 },
        dueDate: String,
        availableDate: String,
        untilDate: String,
        course: { type: String, ref: "CoursesModel", required: true },
    },
    { collection: "assignments" }
);

export default assignmentSchema;