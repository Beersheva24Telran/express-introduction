import Joi from 'joi'
export const schemaPost = Joi.object({
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
  export const schemaPut = Joi.object({
    id: Joi.string()
      .alphanum()
      .pattern(/^J\d{3}/),
    name: Joi.string().valid(
      "Front-End",
      "JAVA",
      "Back-End",
      "Node",
      "AWS",
      "C++"
    ),
    lecturer: Joi.string().valid("Vasya", "Olya", "Vova"),
    hours: Joi.number().integer().min(100).max(600),
  });
  