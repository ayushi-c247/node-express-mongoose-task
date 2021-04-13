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
  body("phone").isNumeric(),
  check('gender').isIn(['Male', 'Female', 'Other']),
  check('status').isIn(["Inactive", "Pending", "Active"]),
  check('role').isIn(['admin', 'user']),

];
const updateProfileValidations = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("name contains only charactor"),
  body("age").isBoolean(),
  check('gender').isIn(['Male', 'Female', 'Other']),
];
const blogvalidations = [
  body("title")
    .not()
    .trim()
    .isEmpty()
    .withMessage("Your title is empty please provide title"),
  body("body")
    .not()
    .trim()
    .isEmpty()
    .withMessage("Your blog body is empty"),

];
const commentValidations = [
  body("userId")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Your ID is not Valid"),
  body("blogId")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Your ID is not Valid"),
  body("body")
    .not()
    .isEmpty()
    .trim()
    .withMessage("comment required!!!!!"),
];
const AdminLoginValidation = [
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
module.exports = { LoginValidation, RegistrationValidation, commentValidations, changePwdvalidation, updateProfileValidations, blogvalidations, AdminLoginValidation };