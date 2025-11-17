const assignment = {
  id: 1, title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10", completed: false, score: 0,
};
const moduleObj = {
  id: "M101",
  name: "Web Development",
  description: "Introduction to Web Dev using React & Node",
  course: "CS5610",
};

export default function WorkingWithObjects(app) {
  const getAssignment = (req, res) => {
    res.json(assignment);
  };
  const getAssignmentTitle = (req, res) => {
    res.json(assignment.title);
  };
  app.get("/lab5/assignment/title", getAssignmentTitle);

  app.get("/lab5/assignment", getAssignment);

  const setAssignmentTitle = (req, res) => {
   const { newTitle } = req.params;
   assignment.title = newTitle;
   res.json(assignment);
 };
 app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);

 const getModule = (req, res) => {
  res.json(moduleObj);
};
app.get("/lab5/module", getModule);

const getModuleName = (req, res) => {
  res.json(moduleObj.name);
};
app.get("/lab5/module/name", getModuleName);

const setModuleName = (req, res) => {
  const { newName } = req.params;
  moduleObj.name = newName;
  res.json(moduleObj);
};
app.get("/lab5/module/name/:newName", setModuleName);


};
