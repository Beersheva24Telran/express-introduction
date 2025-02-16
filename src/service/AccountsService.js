import config from "config";
import bcrypt from "bcrypt";
import { createError } from "../errors/errors.js";
import JwtUtils from "../security/JwtUtils.js";
const userRole = config.get("accounting.user_role");
const adminRole = config.get("accounting.admin_role");
const time_units = {
  h: 3600 * 1000,
  d: 3600 * 1000 * 24,
  m: 60 * 1000,
  s: 1000,
  ms: 1,
};

class AccountsService {
  #accounts = {};

  addAdminAccount(account) {
    this.#addAccount(account, account.role ?? adminRole);
  }
  addUserAccount(account) {
    this.#addAccount(account, userRole);
  }
  #addAccount(account, role) {
    if (this.#accounts[account.email]) {
      throw createError(409, `account ${account.email} already exists`);
    }
    const serviceAccount = this.#toServiceAccount(account, role);
    this.#accounts[account.email] = serviceAccount;
  }

  updateAccount(account) {
    const serviceAccount = this.getAccount(account.email);
    this.#updatePassword(serviceAccount, account.password);
  }
  getAccount(username) {
    const serviceAccount = this.#accounts[username];
    if (!serviceAccount) {
      throw createError(404, `account ${username} doesn't exist`);
    }
    return serviceAccount;
  }
  login(account) {
    const { email, password } = account;
    const serviceAccount = this.#accounts[email];
    this.#checkLogin(serviceAccount, password);
    return JwtUtils.getJwt(this.#accounts[email]);
  }
  delete(username) {
    this.getAccount(username);
    delete this.#accounts[username];
  }
  #toServiceAccount(account, role) {
    const hashPassword = bcrypt.hashSync(
      account.password,
      config.get("accounting.salt_rounds")
    );
    const expiration = getExpiration();
    const serviceAccount = {
      username: account.email,
      role,
      hashPassword,
      expiration,
    };
    return serviceAccount;
  }
  #updatePassword(serviceAccount, newPassword) {
    if (bcrypt.compareSync(newPassword, serviceAccount.hashPassword)) {
      throw createError(
        400,
        `new password should be different from the existing one`
      );
    }
    serviceAccount.hashPassword = bcrypt.hashSync(
      newPassword,
      config.get("accounting.salt_rounds")
    );
    serviceAccount.expiration = getExpiration();
  }
  #checkLogin(serviceAccount, password) {
    if (
      !serviceAccount ||
      !bcrypt.compareSync(password, serviceAccount.hashPassword)
    ) {
      throw createError(400, "Wrong credentials");
    }
    if (new Date().getTime() > serviceAccount.expiration) {
      throw createError(400, "Account's password is expired");
    }
  }
}
function getExpiration() {
  const expiredIn = getExpirationIn();
  return new Date().getTime() + expiredIn;
}
const accountingService = new AccountsService();
export default accountingService;
export function getExpirationIn() {
    const expiredInStr = config.get("accounting.expiredIn");
    const amount = expiredInStr.split(/\D/)[0];
    const parseArray = expiredInStr.split(/\d/);
    const index = parseArray.findIndex((e) => !!e.trim());
    const unit = parseArray[index];
    const unitValue = time_units[unit];
    if (!unitValue) {
        throw createError(500, `Wrong configuration: unit ${unit} doesn't exist`);
    }
    return amount * unitValue ;
}

