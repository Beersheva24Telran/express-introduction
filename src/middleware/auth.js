import { createError } from "../errors/errors.js";
import JwtUtils from "../security/JwtUtils.js";
const BEARER = "Bearer ";
const BASIC = "Basic ";
export function authenticate(paths) {
  return (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (authHeader) {
      if (authHeader.startsWith(BEARER)) {
        jwtAuthentication(req, authHeader);
      } else if (authHeader.startsWith(BASIC)) {
        basicAuthentication(req);
      }
    }

    next();
  };
}
function jwtAuthentication(req, authHeader) {
  const token = authHeader.substring(BEARER.length);
  try {
    const payload = JwtUtils.verifyJwt(token);
    req.user = payload.sub;
    req.role = payload.role;
  } catch (error) {}
}
function basicAuthentication(req) {
  //TODO
}
export function auth(req, res, next) {
  if (!req.user) {
    throw createError(401, "");
  }
}
