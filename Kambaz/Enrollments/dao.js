import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
    function enrollUserInCourse(userId, courseId) {
        const { enrollments } = db;
        const existing = enrollments.find(
            e => e.user === userId && e.course === courseId
        );
        if (!existing) {
            enrollments.push({
                _id: uuidv4(),
                user: userId,
                course: courseId
            });
        }
        return enrollments;
    }

    function unenrollUserFromCourse(userId, courseId) {
        const { enrollments } = db;
        const index = enrollments.findIndex(
            e => e.user === userId && e.course === courseId
        );
        if (index !== -1) {
            enrollments.splice(index, 1);
        }
        return enrollments;
    }

    function isUserEnrolledInCourse(userId, courseId) {
        const { enrollments } = db;
        return enrollments.some(
            e => e.user === userId && e.course === courseId
        );
    }

    function findEnrollmentsForUser(userId) {
        const { enrollments } = db;
        return enrollments.filter(e => e.user === userId);
    }

    function findEnrollmentsForCourse(courseId) {
        const { enrollments } = db;
        return enrollments.filter(e => e.course === courseId);
    }

    return {
        enrollUserInCourse,
        unenrollUserFromCourse,
        isUserEnrolledInCourse,
        findEnrollmentsForUser,
        findEnrollmentsForCourse
    };
}