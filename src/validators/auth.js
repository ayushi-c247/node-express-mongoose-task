const { body, ValidationChain } = require("express-validator");

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
    // .escape()
    // .withMessage("Please enter name and name must have 5 character.")
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
  body("phone")
    .not()
    .isEmpty()
    .withMessage("Please enter phone")
    .trim()
    .isLength({ max: 10, min: 10 })
    .withMessage("Phone number should be conatain digits"),
  body("age").isBoolean(),
  check('hobbie').isIn(['dance', 'games', 'drawing']),
  check('gender').isIn(['Male', 'Female', 'Other']),
  //checkSchema(Schema),
  // checkSchema(genderschema),

];

const updateprofilevalidations = [
  body("email")
    .not()
    .isEmpty()
    .withMessage("Please enter email address.")
    .trim()
    .isEmail()
    .withMessage("Please enter valid email address"),
];
const blogvalidations = [
  body("authorID")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Your ID is not Valid"),
];

// const delevalidation = [
//   params("email")
//     .not()
//     .isEmpty()
//     .withMessage("Please enter email address.")
//     .trim()
//     .isEmail()
//     .withMessage("Please enter valid email address"),
//   // isLength({ max: 120 })
// ];
// const profilevalidation = [
//   body("email")
//     .not()
//     .isEmpty()
//     .withMessage("Please enter email address.")
//     .trim()
//     .isEmail()
//     .withMessage("Please enter valid email address"),
//   body("password")
//     .not()
//     .isEmpty()
//     .withMessage("Please enter password.")
//     .trim()
//     .isLength({ min: 8 })
//     .withMessage("Password must be at least 8 character long."),
// ];


module.exports = { LoginValidation, RegistrationValidation, changePwdvalidation, updateprofilevalidations, blogvalidations };