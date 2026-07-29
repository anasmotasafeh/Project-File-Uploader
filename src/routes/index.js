import { Router } from "express";
import homeRouter from "./homeRouter.js";
import signinRouter from "./signinRouter.js";
import loginRouter from "./loginRouter.js";
import logoutRouter from "./logoutRouter.js";

const indexRouter = Router();

indexRouter.use("/", homeRouter);

indexRouter.use("/signin", signinRouter);
indexRouter.use("/login", loginRouter);
indexRouter.use("/logout", logoutRouter);

export default indexRouter;
