import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
    const dao = AssignmentsDao();

    const findAssignmentsForCourse = async (req, res) => {
        const { courseId } = req.params;
        try {
            const assignments = await dao.findAssignmentsForCourse(courseId);
            res.json(assignments);
        } catch (error) {
            console.error("Error fetching assignments:", error);
            res.status(500).json({ message: "Failed to fetch assignments" });
        }
    };

    const findAssignmentById = async (req, res) => {
        const { assignmentId } = req.params;
        try {
            const assignment = await dao.findAssignmentById(assignmentId);
            if (assignment) {
                res.json(assignment);
            } else {
                res.status(404).json({ message: "Assignment not found" });
            }
        } catch (error) {
            console.error("Error fetching assignment:", error);
            res.status(500).json({ message: "Failed to fetch assignment" });
        }
    };

    const createAssignmentForCourse = async (req, res) => {
        const { courseId } = req.params;
        const currentUser = req.session["currentUser"];
        
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can create assignments" });
        }

        try {
            const assignment = { ...req.body, course: courseId };
            const newAssignment = await dao.createAssignment(assignment);
            res.json(newAssignment);
        } catch (error) {
            console.error("Error creating assignment:", error);
            res.status(500).json({ message: "Failed to create assignment" });
        }
    };

    const deleteAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        const currentUser = req.session["currentUser"];
        
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can delete assignments" });
        }

        try {
            await dao.deleteAssignment(assignmentId);
            res.sendStatus(204);
        } catch (error) {
            console.error("Error deleting assignment:", error);
            res.status(500).json({ message: "Failed to delete assignment" });
        }
    };

    const updateAssignment = async (req, res) => {
        const { assignmentId } = req.params;
        const currentUser = req.session["currentUser"];
        
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can update assignments" });
        }

        try {
            const assignmentUpdates = req.body;
            const updatedAssignment = await dao.updateAssignment(assignmentId, assignmentUpdates);
            if (updatedAssignment) {
                res.json(updatedAssignment);
            } else {
                res.status(404).json({ message: "Assignment not found" });
            }
        } catch (error) {
            console.error("Error updating assignment:", error);
            res.status(500).json({ message: "Failed to update assignment" });
        }
    };

    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.get("/api/assignments/:assignmentId", findAssignmentById);
    app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
    app.delete("/api/assignments/:assignmentId", deleteAssignment);
    app.put("/api/assignments/:assignmentId", updateAssignment);
}