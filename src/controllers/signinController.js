import { createUser, getUserByEmail } from "../services/userService.js";
import { body, validationResult } from "express-validator";

export const getSigninForm = (req, res) => {
  res.render("signinForm", {
    formData: {},
    errors: [],
  });
};

export const validateSignin = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isAlpha()
    .withMessage("Name must contain only letters")
    .isLength({ min: 1, max: 50 }),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Password must be between 3 and 20 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),

  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Does not match the password"),
];

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
