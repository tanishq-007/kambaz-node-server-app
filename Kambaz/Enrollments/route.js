import EnrollmentsDao from "./dao.js";
import CoursesDao from "../Courses/dao.js";

export default function EnrollmentRoutes(app, db) {
    const enrollmentsDao = EnrollmentsDao(db);
    const coursesDao = CoursesDao(db);

    const enrollUserInCourse = (req, res) => {
        const { userId, courseId } = req.params;

        let actualUserId = userId;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            actualUserId = currentUser._id;
        }

        enrollmentsDao.enrollUserInCourse(actualUserId, courseId);
        res.sendStatus(200);
    };

    const unenrollUserFromCourse = (req, res) => {
        const { userId, courseId } = req.params;

        let actualUserId = userId;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            actualUserId = currentUser._id;
        }

        enrollmentsDao.unenrollUserFromCourse(actualUserId, courseId);
        res.sendStatus(200);
    };

    const findEnrollmentsForUser = (req, res) => {
        const { userId } = req.params;

        let actualUserId = userId;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            actualUserId = currentUser._id;
        }

        const enrollments = enrollmentsDao.findEnrollmentsForUser(actualUserId);
        res.json(enrollments);
    };

    app.post("/api/users/:userId/courses/:courseId", enrollUserInCourse);
    app.delete("/api/users/:userId/courses/:courseId", unenrollUserFromCourse);
    app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
}