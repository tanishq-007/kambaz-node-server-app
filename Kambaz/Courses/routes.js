import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
    const dao = CoursesDao(db);
    const enrollmentsDao = EnrollmentsDao(db);

    const findAllCourses = (req, res) => {
        const currentUser = req.session["currentUser"];
        console.log("findAllCourses - currentUser:", currentUser?._id, "role:", currentUser?.role);

        if (currentUser) {
            const courses = dao.findAllCoursesWithEnrollmentStatus(currentUser._id);
            res.json(courses);
        } else {
            const courses = dao.findAllCourses();
            res.json(courses);
        }
    };

    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            console.log("findCoursesForEnrolledUser - currentUser:", currentUser?._id);

            if (!currentUser) {
                return res.status(401).json({ message: "Not authenticated" });
            }
            userId = currentUser._id;
        }
        const courses = dao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };

    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        console.log("createCourse - currentUser:", currentUser?._id, "role:", currentUser?.role);

        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated - please sign in" });
        }

        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can create courses" });
        }

        try {
            const newCourse = dao.createCourse(req.body);
            enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
            res.json(newCourse);
        } catch (error) {
            console.error("Error creating course:", error);
            res.status(500).json({ message: "Failed to create course" });
        }
    };

    const deleteCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can delete courses" });
        }

        const { courseId } = req.params;
        try {
            dao.deleteCourse(courseId);
            res.sendStatus(204);
        } catch (error) {
            console.error("Error deleting course:", error);
            res.status(500).json({ message: "Failed to delete course" });
        }
    };

    const updateCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can update courses" });
        }

        const { courseId } = req.params;
        const courseUpdates = req.body;
        try {
            const updatedCourse = dao.updateCourse(courseId, courseUpdates);
            res.json(updatedCourse);
        } catch (error) {
            console.error("Error updating course:", error);
            res.status(500).json({ message: "Failed to update course" });
        }
    };

    app.get("/api/courses", findAllCourses);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users/current/courses", createCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.put("/api/courses/:courseId", updateCourse);
}