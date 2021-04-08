const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");
const message = require("../../utils/constant")
const userModel = require("../../models/user");


//User Registration
const registration = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const { name, email, password, phone, gender, age, status, role } = req.body
    if (role === "user") {
      let myEmail = await userModel.findOne({
        email
      });
      if (myEmail) {
        return res.status(200).json({
          message: message.USER_EXITS
        });
      }
      const generateSalt = (length = 10) => bcrypt.genSaltSync(length);
      const encryptPassword = (password) => {
        const salt = generateSalt(10);
        return bcrypt.hashSync(password, salt);
      };

      var file = req.files;
      console.log("file", file);
      var data = {
        name,
        age,
        gender,
        email,
        password: encryptPassword(password),
        phone,
        status,
        role,
        image: file[0].path
      }

      var user = new userModel(data);
      user.save(function (error) {
        if (error) {
          throw error;
        }
        else
          return res.json({ message: message.ABOUT_DATA, status: message.STATUS_USER_SUCCESS, userdata: user, });
      });
    }
    else {
      return res.status(400).json({ message: message.ADMIN_ERROR })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message.REGISTRATION_ERROR_MESSAGE });
  }
};


//User Login */
const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  try {
    const { email, password, role } = req.body;
    if (role === "user") {
      let user = await userModel.findOne({ email, status: "Active" });
      if (!user) {
        return res.status(400).json({
          message: message.USER_NOT_EXITS_LOGIN
        });
      }
      const isMatch = await bcrypt.compareSync(password, user.password);
      console.log("ismatch", isMatch);
      if (!isMatch) {
        return res.status(400).json({
          message: message.PASSWORD
        });
      }
      const access = {
        user: {
          id: user._id,
          role: user.role,
        }
      };
      let token = jwt.sign(access, "config.secret", {
        expiresIn: 86400 // expires in 24 hours
      });
      console.log("token", token);

      return res.json({ message: message.LOGIN_SUCCESS, token: token });
    } else {
      return res.status(500).json({ message: message.USER_FAILD })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message.LOGIN_ERROR_MESSAGE });
  }
};

//view-profile of user */
const viewProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    return res.status(200).json({ message: message.MY_PROFILE, user: user });
  } catch (error) {
    return res.status(500).json({ error: message.VIEW_PROFILE_ERROR_MESSAGE });
  }
};

//Update-profile of user*/
const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  try {
    const { name, age, gender, } = req.body
    const userupdates = await userModel.findById(req.user.id);
    console.log("injkknjk", req.files);

    const myprofileImage = req.files && req.files.myfile && req.files.myfile.path ? req.files.myfile.path : null;
    console.log("myprofileImage", myprofileImage);
    var updateddata = {
      age: age ? age : userupdates.age,
      name: name ? name : userupdates.name,
      gender: gender ? gender : userupdates.gender,
      image: myprofileImage ? myprofileImage : userupdates.image
    }
    let updatedata = await userModel.findByIdAndUpdate(userupdates, updateddata, function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      }
    });
    console.log("update", updatedata);
    return res.json({ message: message.USER_UPDATE, updatedata });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message.UPDATE_PROFILE_ERROR_MESSAGE });
  }
};


//Delete-profile of user*/
const deleteProfile = async (req, res) => {
  try {
    await userModel.deleteOne({ _id: req.user.id });
    return res.status(200).json({
      message: message.DELETE_PROFILE,
    });
  } catch (error) {
    console.log("delete error", error);
    return res.status(500).json({ error: message.DELETE_PROFILE_ERROR_MESSAGE });
  }
};


//Delete Profile Image of user*/
const deleteProfileImage = async (req, res) => {
  try {
    let imagenull = {
      image: null
    }
    var userdetails = await userModel.updateOne({ _id: req.user.id }, imagenull);
    return res.status(200).json({
      message: message.DELETE_PROFILE_DELETE, userdetails: userdetails
    });
  } catch (error) {
    console.log("user delete error", error);
    return res.status(500).json({ error: message.DELETE_IMAGE_ERROR_MESSAGE });
  }
};


//module exports
module.exports = { registration, login, viewProfile, deleteProfile, updateProfile, deleteProfileImage, };


