const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");
const message = require("../../utils/constant")
const userModel = require("../../models/user");
const blogModel = require("../../models/blog");


const registration = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    const { name, email, password, phone, gender, hobbie, age, status, role } = req.body
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
        hobbie,
        email,
        password: encryptPassword(password),
        phone,
        status,
        role,
        image: file[0].path
      }

      var user = new userModel(data);
      console.log("encrupffvf", user.password);
      user.save(function (error) {
        console.log(user);
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



//********************************Login-user */

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
      let user = await userModel.findOne({
        email
      });
      console.log("userdetails", user);
      if (!user) {
        return res.status(400).json({
          message: message.USER_NOT_EXITS
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
      console.log("accccv", access);

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

//****************************view-profile */


const viewProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json(errors.array());
  }
  try {
    // req.user is getting fetched from Middleware after token authentication
    const user = await userModel.findById(req.user.id);
    console.log("keyprofile=", user);
    if (!user) {
      return res.status(500).json({ error: message.USER_NOT_EXITS });
    } else {
      console.log("profile user");
      return res.status(200).json({ message: message.MY_PROFILE, user: user });
    }
  } catch (error) {
    return res.status(500).json({ error: message.VIEW_PROFILE_ERROR_MESSAGE });
  }
};

//*****************Update-profile */

const updateProfile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  try {
    console.log("In updateprofile");

    const { name, age, gender, hobbie, } = req.body
    const userupdates = await userModel.findById(req.user.id);
    console.log("(userupdates", userupdates);
    if (!userupdates) {
      return res.status(500).json({ error: message.USER_NOT_EXITS });
    } else {
      console.log("elseupdate");
      var file = req.files;
      var updateddata = {
        age: age || userupdates.age,
        hobbie: hobbie || userupdates.hobbie,
        name: name || userupdates.name,
        gender: gender || userupdates.gender,
        image: file[0].path || userupdates.image
      }
      let updatedata = await userModel.findByIdAndUpdate(userupdates, updateddata, function (
        err,
        result
      ) {
        if (err) {
          res.send(err);
        } else {
          res.json(result);
        }
      });
      console.log("update", updatedata);
      return res.json({ message: message.USER_UPDATE, updatedata });


    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: message.UPDATE_PROFILE_ERROR_MESSAGE });
  }
};



//*****************delete-profile */
const deleteProfile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  try {
    console.log("delete");
    const user = await userModel.findById(req.user.id);
    console.log("In delete ", user);
    if (!user) {
      return res.status(200).json({
        message: message.DELETE_PROFILE_FAILD,
      });
    } else {
      await userModel.deleteOne({ _id: req.user.id });
      return res.status(200).json({
        message: message.DELETE_PROFILE,
      });
    }

  } catch (error) {
    console.log("delete error", error);
    return res.status(500).json({ error: message.DELETE_PROFILE_ERROR_MESSAGE });
  }
};

//************************ delete-Profile-Image*/


const deleteProfileImage = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  try {
    console.log("deleteProfileImage");
    const user = await userModel.findById(req.user.id);
    console.log("In deleteProfileImage ", user);
    if (!user) {
      return res.status(500).json({
        message: message.DELETE_PROFILE_FAILD,
      });
    } else {
      var imagenull = {
        image: null
      }
      var userdetails = await userModel.updateOne({ _id: req.user.id }, imagenull);
      return res.status(200).json({
        message: message.DELETE_PROFILE_DELETE, userdetails: userdetails
      });
    }

  } catch (error) {
    console.log("delete error", error);
    return res.status(500).json({ error: message.DELETE_IMAGE_ERROR_MESSAGE });
  }
};

const userAndBlog = async (req, res) => {
  try {
    console.log("userAndBlog");
    const user = await userModel.findById(req.user.id);
    console.log("In delete ", user);
    if (!user) {
      return res.status(200).json({
        message: message.DELETE_PROFILE_FAILD,
      });
    }
    //const comment = "hello comment";
    // const blogdata = await blogModel.find({ authorId: req.user.id })
    // console.log("blogdata", blogdata);
    // const userblogadata = await userModel.findById({ _id: req.user.id })
    // console.log("i m here one");
    // userblogadata.blogs.push(blogdata._id);
    // console.log("i m here gfht");
    // await userblogadata.save()
    //return userblogadata
    // await userModel.findById({ _id: req.user.id }).populate("blogs").exec()
    const blogdata = userModel.findOne({ _id: req.user.id })
      .populate('blogs').exec((err, posts) => {
        console.log("Populated User ", blogdata);
      })
    //console.log("userblogadataaass", userblogadataaass);
    // return res.status(200).json({
    //   userAndBlogData: userAndBlogData
    // });

  } catch (error) {
    console.log("userAndBlog", error);
    return res.status(500).json({ error: message.DELETE_IMAGE_ERROR_MESSAGE });
  }

}

module.exports = { registration, login, viewProfile, deleteProfile, updateProfile, deleteProfileImage, userAndBlog };


