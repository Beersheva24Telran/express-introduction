import Joi from "joi";
import config from 'config';
import { joiPasswordExtendCore } from "joi-password";
const joiPassword = Joi.extend(joiPasswordExtendCore);
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
export const schemaUser = Joi.string().email().required();
const passwordSchema = joiPassword
  .string()
  .min(8)
  .minOfSpecialCharacters(1)
  .minOfLowercase(1)
  .minOfUppercase(1)
  .minOfNumeric(1)
  .noWhiteSpaces()
  .onlyLatinCharacters()
  .doesNotInclude(["password", "12345"])
  .required();
export const schemaAccount = Joi.object({
  email: schemaUser,
  password: passwordSchema,
  role: Joi.string().valid(...config.get("accounting.roles"))
});
