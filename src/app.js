import "dotenv/config";

import express from "express";
import session from "express-session";
import passport from "./config/passport.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import path from "node:path";

import prisma from "../lib/prisma.js";
import indexRoute from "./routes/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRoute);

app.use(notFound);
app.use(errorHandler);

export default app;
