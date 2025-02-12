import express from "express";
import { schemaPost, schemaPut } from "../validation/schemas.js";
import morgan from "morgan";
import fs from "node:fs";
import { errorHandler } from "../errors/errors.js";
import { expressValidator } from "../middleware/validation.js";
import coursesRoute from "../routes/courses.js";
import { loggerCombined } from "../logs/logger.js";

const app = express();
const port = process.env.PORT || 3500;




app.use(express.json());
app.use(loggerCombined);

app.use(expressValidator({ POST: schemaPost, PUT: schemaPut }));
app.use('/api/v1/courses', coursesRoute)
app.use((req, res) => {
  res.status(404).send(`path ${req.path} is not found`)
})
app.listen(port, () => console.log(`server is listening on port ${port}`));
app.use(errorHandler);

