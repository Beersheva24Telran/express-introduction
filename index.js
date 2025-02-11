import express from "express";
import Joi from "joi";
import morgan from 'morgan'
import fs from 'node:fs'
const schemaPost = Joi.object({
  id: Joi.string()
    .alphanum()
    .pattern(/^J\d{3}/)
    .required(),
  name: Joi.string()
    .valid("Front-End", "JAVA", "Back-End", "Node", "AWS", "C++")
    .required(),
  lecturer: Joi.string().valid("Vasya", "Olya", "Vova").required(),
  hours: Joi.number().integer().min(100).max(600).required(),
});
const schemaPut = Joi.object({
  id: Joi.string()
    .alphanum()
    .pattern(/^J\d{3}/),
  name: Joi.string().valid(
    "Front-End",
    "JAVA",
    "Back-End",
    "Node",
    "AWS",
    "C++",
  ),
  lecturer: Joi.string().valid("Vasya", "Olya", "Vova"),
  hours: Joi.number().integer().min(100).max(600),
});
const courses = {
  J101: { id: "J101", name: "Front-End", lecturer: "Vasya", hours: 200 },
  J102: { id: "J102", name: "JAVA", lecturer: "Vasya", hours: 300 },
  J103: { id: "J103", name: "Back-End", lecturer: "Olya", hours: 350 },
  J104: { id: "J104", name: "Node", lecturer: "Olya", hours: 150 },
  J105: { id: "J105", name: "AWS", lecturer: "Vova", hours: 200 },
  J106: { id: "J106", name: "C++", lecturer: "Vova", hours: 500 },
};
const app = express();
const port = process.env.PORT || 3500;
function validator(schema) {
    return (req, res, next) =>{
        const {error} = schema.validate(req.body, {abortEarly: false});
        if(error) {
            throw createError(400, error.details.map(d => d.message).join(";"))
        }
        next();
    }
}
function expressValidator(schemasObj) {
    return (req, res, next) => {
        if(req._body) {
            const {error} = schemasObj[req.method].validate(req.body, {abortEarly: false});
            if(error) {
                req.errorMessage = error.details.map(d => d.message).join(";");
            }
            req.validated = true;
        }
        next();
    }
}
function createError(status, message) {
    return {status, message};
}
function errorHandler(error, req, res, next) {
    let {status, message} = error;
    status = status ?? 500;
    message = message ?? "internal server error " + error
    res.status(status).send(message);
}
function valid(req, res, next) {
    if(!req.validated) {
        throw createError(500, "server has not validated request")
    }
    if(req.errorMessage) {
        throw createError(400, req.errorMessage)
    }
    next();
}
const logStream = fs.createWriteStream('log.txt')
app.use(express.json());
app.use(morgan('combined', {
    stream: logStream
}));

app.use(expressValidator({"POST": schemaPost, "PUT": schemaPut}));
app.post("/api/v1/courses",validator(schemaPost), (req, res) => {
    
    const id = req.body.id;
    if(courses[id]) {
        throw createError(400, `course with id ${id} already exists`)
    }
    courses[id] = req.body;
    console.log(courses);
    res.status(201).send(courses[id]);
});
app.get("/api/v1/courses/:id", (req, res) => {

    notFound(req.params.id);
  res.send(courses[req.params.id]);
});
app.delete("/api/v1/courses/:id",valid, (req, res) => {
    notFound(req.params.id)
  delete courses[req.params.id];
  console.log(courses);
  res.send("deleted");
});
app.put("/api/v1/courses/:id",valid, (req, res) => {
   
  const id = req.params.id;
  notFound(id)
  courses[id] = { ...courses[id], ...req.body };
  res.send(courses[id]);
});
app.get("/api/v1/courses", (req, res) => {
  const { lecturer, hours, name } = req.query;
  res.send(
    Object.values(courses).filter(
      (c) =>
        (lecturer ? c.lecturer == lecturer : true) &&
        (hours ? c.hours == hours : true) &&
        (name ? c.name == name : true)
    )
  );
});

app.listen(port, () => console.log(`server is listening on port ${port}`));
app.use(errorHandler);
function notFound(id) {
    if (!courses[id]) {
        throw createError(404, `course with id ${id} doesn't exist`);
    }
}

