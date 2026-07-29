import { createUser, getUserByEmail } from "../services/userService.js";
import { validationResult } from "express-validator";

export const getSigninForm = (req, res) => {
  res.render("signinForm", {
    formData: {},
    errors: [],
  });
};

export const postSignin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("signinForm", {
        formData: req.body,
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    const userExist = await getUserByEmail(email);
    if (userExist) {
      return res.status(400).render("signinForm", {
        formData: req.body,
        errors: [{ msg: "This email is taken" }],
      });
    }

    const user = await createUser({ name, email, password });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).redirect("/");
    });
  } catch (error) {
    next(error);
  }
};
