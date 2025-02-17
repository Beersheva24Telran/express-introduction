import { createError } from "../errors/errors.js";
import JwtUtils from "../security/JwtUtils.js";
import accountingService from "../service/AccountsService.js";

const BEARER = "Bearer ";
const BASIC = "Basic ";
export function authenticate(paths) {
  return (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (authHeader) {
      if (authHeader.startsWith(BEARER)) {
        jwtAuthentication(req, authHeader);
      } else if (authHeader.startsWith(BASIC)) {
        basicAuthentication(req, authHeader);
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
    req.authType = "jwt"
  } catch (error) {}
}
function basicAuthentication(req, authHeader) {
  const userNamePassword64 = authHeader.substring(BASIC.length); //username:password
  const userNamePassword = Buffer.from(userNamePassword64, 'base64').toString('utf-8');
  const usernamePasswordArr = userNamePassword.split(":");
  
  try {
    const serviceAccount = accountingService.getAccount(usernamePasswordArr[0]);
    accountingService.checkLogin(serviceAccount, usernamePasswordArr[1]);
    req.user = usernamePasswordArr[0];
    req.role = serviceAccount.role;
    req.authType = "basic";
  } catch (error) {
    
  }

}
export function auth(req, res, next) {
  if (!req.user) {
    throw createError(401, "");
  }
  next();
}
