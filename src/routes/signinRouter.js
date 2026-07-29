import { Router } from "express";
import { getSigninForm, postSignin } from "../controllers/signinController.js";
import validateSignin from "../middleware/validateSignin.js";
const signinRouter = Router();

signinRouter.get("/", getSigninForm);
signinRouter.post("/", validateSignin, postSignin);

export default signinRouter;
