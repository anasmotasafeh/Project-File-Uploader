import { body, validationResult } from "express-validator";

const validateSignin = [
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

export default validateSignin;
