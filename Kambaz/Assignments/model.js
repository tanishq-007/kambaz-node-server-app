import mongoose from "mongoose";
import assignmentSchema from "./schema.js";

const AssignmentsModel = mongoose.model("AssignmentsModel", assignmentSchema);

export default AssignmentsModel;