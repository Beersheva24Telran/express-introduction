import express from "express";
import { schemaPost, schemaPut } from "../validation/schemas.js";
import { authenticate } from "../middleware/auth.js";
import { errorHandler } from "../errors/errors.js";
import { expressValidator } from "../middleware/validation.js";
import coursesRoute from "../routes/courses.js";
import { logger } from "../logger/logger.js";
import accountsRoute from "../routes/accounts.js";

const app = express();
const port = process.env.PORT || 3500;




app.use(express.json());
app.use(logger);

app.use(authenticate());
app.use('/api/v1/courses', coursesRoute)
app.use('/accounts', accountsRoute)
app.use((req, res) => {
  res.status(404).send(`path ${req.path} is not found`)
})
app.listen(port, () => console.log(`server is listening on port ${port}`));
app.use(errorHandler);

