// import bcrypt from "bcrypt";
// import crypto from "crypto";



// let token;
// if (user.role === 'admin') {
//   token = jwt.sign({ _id, role: 'admin' }, process.env.JWT_SECRET);
// } else {
//   token = jwt.sign({ _id, role: 'user' }, process.env.JWT_SECRET);
// }
// user.token = token;
// return user.save().then(() => {
//   return token;
// });
const message = require("./constant")


const jwt = require("jsonwebtoken");


module.exports = function (req, res, next) {

  try {
    const token = req.header("Authorization");
    console.log("authtoken == ", token);
    if (!token) return res.status(401).json({ message: message.AUTH_ERROR });
    const decoded = jwt.verify(token, "config.secret");
    req.user = decoded.user
    console.log("token", req.user);
    //userId = decoded.user
    //console.log("auth token==  ", userId);
    //console.log("decoded", decoded);
    return next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: message.INVALID_TOKEN });
  }
};
































// /**
// |--------------------
// | GENERATE PASSWORD
// |--------------------
// */
// /**
//  *
//  * @method generatePassword - Generate password
//  * @arguments  length length of password
//  * @arguments  text text of password
//  * @arguments  possible string of possible password

//   @SuccessExample  Success
//     {
//    return text
//   }
//  */

// const generatePassword = (length = 8) => {
//   let text = "";
//   const possible = process.env.POSSIBLE_PASSWORD;
//   // 'abcdefghijkmnopqrstuvwxyz!@#$%^&*()ABCDEFGHJKLMNOPQRSTUVWXYZ023456789';
//   for (let i = 0; i < length; i++)
//     text += possible.charAt(Math.floor(Math.random() * possible.length));
//   return text;
// };

// /*
// |------------------
// | GENERATE SALT
// |------------------
// */
// /**
//  *
//  * @method generateSalt - Generate Salt
//  * @arguments  JWTSecrete secrete key of jwt
//  * @arguments  algorithm algorithm of salt
//  * @arguments  password password of salt
//  * @arguments  crypted to store salt password

//   @SuccessExample  Success
//     {
//    return crypted
//   }
//  */

// const generateSalt = (length = 10) => bcrypt.genSaltSync(length);

// /**
//  * Encrypt the password using bcrypt algorithm
//  */
// const encryptPassword = (password) => {
//   const salt = generateSalt(10);
//   return bcrypt.hashSync(password, salt);
// };

// /**
//  * Compare the password using bcrypt algorithm
//  */
// const comparePassword = (password, hash) => bcrypt.compareSync(password, hash);
// /**

// /**
//  * JWT Secret
//  */
// const JWTSecrete = process.env.HASH_JWT_SECRET;
// // 'qwertyuiop[]lkjhgfdazxcvbnm,./!@#$%^&*()';
// /**
//  * Encrypt Email and Id
//  */
// const algorithm = process.env.ALGORITHM;
// // 'aes-256-cbc';
// const password = process.env.PASSWORD;

// export {
//   encryptPassword,
//   comparePassword,
//   generateSalt,
//   JWTSecrete,
//   generatePassword,
// };
