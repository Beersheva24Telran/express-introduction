import config from 'config';
import bcrypt from 'bcrypt'
import { createError } from '../errors/errors';
const userRole = config.get("accounting.user_role");
const adminRole = config.get("accounting.admin_role");
const time_units = {
    "h": 3600 * 1000,
    "d": 3600 * 1000 * 24,
    'm': 60 * 1000,
    's': 1000,
    'ms': 1
}

class AccountsService {
    #accounts = {}
    
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
        const serviceAccount = getAccount(account.email);
        this.#updatePassword(serviceAccount, account.password);
    }
    getAccount(username){
        const serviceAccount = this.#accounts[username];
        if(!serviceAccount) {
            throw createError(404, `account ${username} doesn't exist`)
        }
        return serviceAccount;
    }
    login(account) {
        //TODO
    }
    delete(username) {
        this.getAccount(username);
        delete this.#accounts[username];
    }
    #toServiceAccount(account, role) {
        const hashPassword = bcrypt.hashSync(account.password, config.get("accounting.salt_rounds"));
        const expiration = getExpiration();
        const serviceAccount = {username: account.email, role, hashPassword, expiration};
        return serviceAccount;

    }
    #updatePassword(serviceAccount, newPassword) {
        if(bcrypt.compareSync(newPassword, serviceAccount.hashPassword)) {
            throw createError(400, `new password should be different from the existing one`)
        }
        serviceAccount.hashPassword = bcrypt.hashSync(newPassword, config.get("accounting.salt_rounds"))
    }

}
function getExpiration() {
    const expiredInStr = config.get("accounting.expiredIn");
    const amount = expiredInStr.split(/\D/)[0];
    const unit = expiredInStr.split(/\d/)[1];
    const unitValue = time_units[unit];
    if(!unitValue){
        throw createError(500, `Wrong configuration: unit ${unit} doesn't exist`);
    }
    return new Date().getTime() + amount * unitValue;

}