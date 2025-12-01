import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
    const dao = CoursesDao();
    const enrollmentsDao = EnrollmentsDao();

    const findAllCourses = async (req, res) => {
        try {
            const courses = await dao.findAllCourses();
            res.json(courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
            res.status(500).json({ message: "Failed to fetch courses" });
        }
    };

    const findCoursesForEnrolledUser = async (req, res) => {
        let { userId } = req.params;

        console.log("=== DEBUG SESSION ===");
        console.log("req.session:", req.session);
        console.log("req.session.currentUser:", req.session["currentUser"]);

        if (!userId || userId === "current") {
            const currentUser = req.session["currentUser"];
            console.log("currentUser object:", JSON.stringify(currentUser, null, 2));

            if (!currentUser) {
                console.log("NO CURRENT USER - should return 401");
                return res.status(401).json({ message: "Not authenticated" });
            }

            console.log("currentUser._id:", currentUser._id);
            userId = currentUser._id;
        }

        console.log("Final userId:", userId);

        try {
            const courses = await enrollmentsDao.findCoursesForUser(userId);
            res.json(courses);
        } catch (error) {
            console.error("Error fetching user courses:", error);
            res.status(500).json({ message: "Failed to fetch enrolled courses" });
        }
    };

    const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                return res.status(401).json({ message: "Not authenticated" });
            }
            uid = currentUser._id;
        }
        try {
            const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
            res.json(status);
        } catch (error) {
            console.error("Error enrolling user:", error);
            res.status(500).json({ message: "Failed to enroll in course" });
        }
    };

    const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                return res.status(401).json({ message: "Not authenticated" });
            }
            uid = currentUser._id;
        }
        try {
            const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
            res.json(status);
        } catch (error) {
            console.error("Error unenrolling user:", error);
            res.status(500).json({ message: "Failed to unenroll from course" });
        }
    };

    const createCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated - please sign in" });
        }
        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can create courses" });
        }
        try {
            const newCourse = await dao.createCourse(req.body);
            await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
            res.json(newCourse);
        } catch (error) {
            console.error("Error creating course:", error);
            res.status(500).json({ message: "Failed to create course" });
        }
    };

    const deleteCourse = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        if (currentUser.role !== "FACULTY") {
            return res.status(403).json({ message: "Only faculty can delete courses" });
        }
        const { courseId } = req.params;
        try {
            await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
            const status = await dao.deleteCourse(courseId);
            res.json(status);
        } catch (error) {
            console.error("Error deleting course:", error);
            res.status(500).json({ message: "Failed to delete course" });
        }
    };

    const updateCourse = async (req, res) => {
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
            const updatedCourse = await dao.updateCourse(courseId, courseUpdates);
            res.json(updatedCourse);
        } catch (error) {
            console.error("Error updating course:", error);
            res.status(500).json({ message: "Failed to update course" });
        }
    };

    // Register routes - IMPORTANT: specific routes before parameterized routes
    app.get("/api/courses", findAllCourses);
    app.get("/api/users/current/courses", findCoursesForEnrolledUser);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.post("/api/users/current/courses", createCourse);
    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.put("/api/courses/:courseId", updateCourse);
}