import express from 'express'
import { valid, validator } from '../middleware/validation.js';
import { schemaPost } from '../validation/schemas.js';
import service from '../service/CoursesService.js';
const coursesRoute = express.Router();
coursesRoute.post("/", validator(schemaPost), (req, res) => {
  const course = service.addCourse(req.body);
  res.status(201).send(course);
});
coursesRoute.get("/:id", (req, res) => {
  const id = req.params.id;
  res.send(service.getCourse(id));
});
coursesRoute.delete("/:id",  (req, res) => {
  const course = service.removeCourse(req.params.id)
  res.send(course);
});
coursesRoute.put("/:id", valid, (req, res) => {
  const course = service.updateCourse(req.params.id, req.body)
  res.send(course);
});
coursesRoute.get("/", (req, res) => {
  res.send(service.findCourses(req.query));
  
});
export default coursesRoute;