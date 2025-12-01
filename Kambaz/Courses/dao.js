import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import enrollmentModel from "../Enrollments/model.js";

export default function CoursesDao() {
    function findAllCourses() {
        return model.find({});
    }

    async function findAllCoursesWithEnrollmentStatus(userId) {
        const courses = await model.find({});
        const enrollments = await enrollmentModel.find({ user: userId });
        const enrolledCourseIds = enrollments.map(e => e.course);

        return courses.map(course => ({
            ...course.toObject(),
            enrolled: enrolledCourseIds.includes(course._id)
        }));
    }

    function createCourse(course) {
        const newCourse = { ...course, _id: uuidv4() };
        return model.create(newCourse);
    }

    function deleteCourse(courseId) {
        return model.deleteOne({ _id: courseId });
    }

    function updateCourse(courseId, courseUpdates) {
        return model.updateOne({ _id: courseId }, { $set: courseUpdates });
    }

    return {
        findAllCourses,
        createCourse,
        deleteCourse,
        updateCourse,
        findAllCoursesWithEnrollmentStatus
    };
}