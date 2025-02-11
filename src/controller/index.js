import express from "express";
import { schemaPost, schemaPut } from "../validation/schemas.js";
import morgan from "morgan";
import fs from "node:fs";
import service from "../service/CoursesService.js";
import { errorHandler, createError } from "../errors/errors.js";
import { expressValidator, valid, validator } from "../middleware/validation.js";

const app = express();
const port = process.env.PORT || 3500;




const logStream = fs.createWriteStream("log.txt");
app.use(express.json());
app.use(
  morgan("combined", {
    stream: logStream,
  })
);

app.use(expressValidator({ POST: schemaPost, PUT: schemaPut }));
app.post("/api/v1/courses", validator(schemaPost), (req, res) => {
  const course = service.addCourse(req.body);
  res.status(201).send(course);
});
app.get("/api/v1/courses/:id", (req, res) => {
  const id = req.params.id;
  res.send(service.getCourse(id));
});
app.delete("/api/v1/courses/:id", valid, (req, res) => {
  const course = service.removeCourse(req.params.id)
  res.send(course);
});
app.put("/api/v1/courses/:id", valid, (req, res) => {
  const course = service.updateCourse(req.params.id, req.body)
  res.send(course);
});
app.get("/api/v1/courses", (req, res) => {
  res.send(service.findCourses(req.query));
  
});

app.listen(port, () => console.log(`server is listening on port ${port}`));
app.use(errorHandler);

