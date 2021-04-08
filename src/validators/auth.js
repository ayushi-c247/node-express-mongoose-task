const { body, checkSchema, check, validationResult } = require("express-validator/check");

const LoginValidation = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email address.")
    .trim()
    .isEmail()
    .withMessage("Please enter valid email address"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password.")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 8 character long."),
  check('role').isIn(['admin', 'user']),
];
const changePwdvalidation = [
  body("newpassword")
    .not()
    .isEmpty()
    .withMessage("Please enter password.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 character long."),
];
const RegistrationValidation = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("name contains only charactor"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email address.")
    .trim()
    .isEmail()
    .withMessage("Please enter valid email address"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Please enter password.")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 character long."),
  body("age").isBoolean(),
  check('gender').isIn(['Male', 'Female', 'Other']),
  check('status').isIn(["Inactive", "Pending", "Active"]),
  check('role').isIn(['admin', 'user']),

];

const updateprofilevalidations = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email address.")
    .trim()
    .isEmail()
];
const blogvalidations = [
  body("authorID")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Your ID is not Valid"),
];

module.exports = { LoginValidation, RegistrationValidation, changePwdvalidation, updateprofilevalidations, blogvalidations };