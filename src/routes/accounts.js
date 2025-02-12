import express from 'express';
import { validator } from '../middleware/validation';
import { schemaAccount, schemaUser } from '../validation/schemas';
const accountsRoute = express.Router();

accountsRoute.post("/admin", validator(schemaAccount), (req, res) => {
    accountService.addAdminAccount(req.body);
    res.status(201).send("account added")
})
accountsRoute.post("/user", validator(schemaAccount), (req, res) => {
    accountService.addUserAccount(req.body);
    res.status(201).send("account added")
})
accountsRoute.put("/", validator(schemaAccount), (req, res) => {
    accountService.updateAccount(req.body);
    res.send("account updated")
})
accountsRoute.get("/", validator(schemaUser),(req, res) => {
   const account =  accountService.getAccount(req.body); 
   res.send(account);
});
accountsRoute.post("/login", validator(schemaAccount), (req, res) => {
    const token = accountService.login(req.body);
    res.send(token);
})
accountsRoute.delete("/",validator(schemaUser), (req,res) => {
    accountService.delete(req.body);
    res.send("deleted")
} )
export default accountsRoute;