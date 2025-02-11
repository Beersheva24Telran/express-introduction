import { createError } from "../errors/errors.js";
class CoursesService {
  #courses = {
    J101: { id: "J101", name: "Front-End", lecturer: "Vasya", hours: 200 },
    J102: { id: "J102", name: "JAVA", lecturer: "Vasya", hours: 300 },
    J103: { id: "J103", name: "Back-End", lecturer: "Olya", hours: 350 },
    J104: { id: "J104", name: "Node", lecturer: "Olya", hours: 150 },
    J105: { id: "J105", name: "AWS", lecturer: "Vova", hours: 200 },
    J106: { id: "J106", name: "C++", lecturer: "Vova", hours: 500 },
  };
  addCourse(course) {
    const id = course.id;
    if (this.#courses[id]) {
      throw createError(409, `course with id ${id} already exists`);
    }
    this.#courses[id] = course;
    return this.#courses[id];
  }
  removeCourse(id) {
    this.#notFound(id);
    const course = this.#courses[id];
    delete this.#courses[id];
    return course;
  }
  getCourse(id) {
    this.#notFound(id);
    return this.#courses[id];
  }
  findCourses(filter) {
    const { lecturer, hours, name } = filter;
    return Object.values(this.#courses).filter(
      (c) =>
        (lecturer ? c.lecturer == lecturer : true) &&
        (hours ? c.hours == hours : true) &&
        (name ? c.name == name : true)
    );
  }
  updateCourse(id, updatingObj) {
    this.#notFound(id);
    this.#courses[id] = { ...this.#courses[id], ...updatingObj };
    return this.#courses[id]
  }
  #notFound(id) {
    if (!this.#courses[id]) {
      throw createError(404, `course with id ${id} doesn't exist`);
    }
  }
}
const service = new CoursesService();
export default service;
