import { Router } from "express";
import { getSigninForm, postSingin } from "../controllers/signinController.js";

const signinRouter = Router();

signinRouter.get("/", getSigninForm);
signinRouter.post("/", postSingin);

export default signinRouter;
