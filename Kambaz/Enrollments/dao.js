import model from "./model.js";
import "../Courses/model.js";
export default function EnrollmentsDao() {
    function enrollUserInCourse(userId, courseId) {
        return model.create({
            user: userId,
            course: courseId,
            _id: `${userId}-${courseId}`,
        });
    }

    function unenrollUserFromCourse(user, course) {
        return model.deleteOne({ user, course });
    }

    async function findCoursesForUser(userId) {
        const enrollments = await model.find({ user: userId }).populate("course");
        const courses = enrollments
            .map((enrollment) => enrollment.course)
            .filter((course) => course !== null);  // Filter out any nulls
        return courses;
    }

    async function findUsersForCourse(courseId) {
        const enrollments = await model.find({ course: courseId }).populate("user");
        return enrollments.map((enrollment) => enrollment.user);
    }

    async function isUserEnrolledInCourse(userId, courseId) {
        const enrollment = await model.findOne({ user: userId, course: courseId });
        return enrollment !== null;
    }

    async function findEnrollmentsForUser(userId) {
        return model.find({ user: userId });
    }

    async function findEnrollmentsForCourse(courseId) {
        return model.find({ course: courseId });
    }

    function unenrollAllUsersFromCourse(courseId) {
        return model.deleteMany({ course: courseId });
    }

    return {
        findCoursesForUser,
        findUsersForCourse,
        enrollUserInCourse,
        unenrollUserFromCourse,
        isUserEnrolledInCourse,
        findEnrollmentsForUser,
        findEnrollmentsForCourse,
        unenrollAllUsersFromCourse,
    };
}