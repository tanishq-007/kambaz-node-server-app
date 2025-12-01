import ModulesDao from "./dao.js";

export default function ModulesRoutes(app) {
    const dao = ModulesDao();

    const findModulesForCourse = async (req, res) => {
        const { courseId } = req.params;
        try {
            const modules = await dao.findModulesForCourse(courseId);
            res.json(modules);
        } catch (error) {
            console.error("Error fetching modules:", error);
            res.status(500).json({ message: "Failed to fetch modules" });
        }
    };

    const createModuleForCourse = async (req, res) => {
        const { courseId } = req.params;
        try {
            const newModule = await dao.createModule(courseId, req.body);
            res.json(newModule);
        } catch (error) {
            console.error("Error creating module:", error);
            res.status(500).json({ message: "Failed to create module" });
        }
    };

    const deleteModule = async (req, res) => {
        const { courseId, moduleId } = req.params;
        try {
            const status = await dao.deleteModule(courseId, moduleId);
            res.json(status);
        } catch (error) {
            console.error("Error deleting module:", error);
            res.status(500).json({ message: "Failed to delete module" });
        }
    };

    const updateModule = async (req, res) => {
        const { courseId, moduleId } = req.params;
        try {
            const updated = await dao.updateModule(courseId, moduleId, req.body);
            res.json(updated);
        } catch (error) {
            console.error("Error updating module:", error);
            res.status(500).json({ message: "Failed to update module" });
        }
    };

    app.get("/api/courses/:courseId/modules", findModulesForCourse);
    app.post("/api/courses/:courseId/modules", createModuleForCourse);
    app.put("/api/courses/:courseId/modules/:moduleId", updateModule);
    app.delete("/api/courses/:courseId/modules/:moduleId", deleteModule);
}