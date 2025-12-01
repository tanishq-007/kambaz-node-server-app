import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        _id: String,
        course: { type: String, ref: "CoursesModel" },
        user: { type: String, ref: "UsersModel" },
        grade: Number,
        letterGrade: String,
        enrollmentDate: Date,
        status: {
            type: String,
            enum: ["ENROLLED", "DROPPED", "COMPLETED"],
            default: "ENROLLED",
        },
    },
    { collection: "enrollments" }
);

export default enrollmentSchema;