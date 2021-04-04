
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");
const message = require("../../utils/constant")
const adminModel = require("../../models/admin");
const userModel = require("../../models/user");
const blogModel = require("../../models/blog");
const commentModel = require("../../models/comment");

const adminLogin = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        console.log("login .......................");
        const { email, password, } = req.body;
        console.log(req.body)
        let admin = await adminModel.findOne({
            email
        });
        console.log("admindetails", admin);
        if (!admin) {
            return res.status(400).json({
                message: message.ADMIN_NOT_EXITS
            });
        }
        if (email == admin.email && password == admin.password) {
            const access = {
                admin: {
                    id: admin._id,
                }
            };
            console.log("accccv", access);

            let token = jwt.sign(access, "config.secret", {
                expiresIn: 86400 // expires in 24 hours
            });
            console.log("token", token);

            return res.json({ message: message.LOGIN_SUCCESS, token: token });

        } else {
            return res.status(400).json({
                message: message.PASSWORD
            });
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: message.LOGIN_ERROR_MESSAGE });
    }
};

const helloprogram = async (req, res) => {
    res.render("index.ejs", { emailerr: " ", passworderr: " ", emailValue: "", users: "", blog: "" });
}
const login = async (req, res) => {
    var flag = 0;
    const { email, password } = req.body;
    var response = {
        email: email,
        password: password,
    };
    if (email == "") {
        var emailerr = "Please Enter Email";
        console.log("please Enter Email");
        flag = 1;
    }
    if (password == "") {
        flag = 1;
        var passworderr = "Please Enter Password";
        console.log("please enter password")

    }
    if (flag == 1)
        res.render('index.ejs', {
            emailValue: email,
            emailerr: emailerr,
            passworderr: passworderr,
        });
    var data = await adminModel.find();
    console.log("data", data[0]);
    if (email === data[0].email && password === data[0].password) {

        const users = await userModel.find();
        // const totalUser = await userModel.countDocuments();
        // var element = [];
        // var count = 0, sno;
        // for (let index = 0; index < users.length; index++) {
        //     sno = count++
        //     element.push(users[index]._id);
        // }
        const blog = await blogModel.find();

        console.log("blog", blog);
        res.render('dashbord.ejs', {
            users: users,
            blog: blog,
        })
    } else {
        res.render('index.ejs', {
            emailValue: email,
            emailerr: emailerr,
            passworderr: passworderr,
        });
    }
}

const deleteUser = async (req, res) => {
    await UsersModel.findByIdAndRemove(req.params.id);
    res.redirect("../display");
}
const display = async (req, res) => {
    res.render('dashbord.ejs');
}
module.exports = { adminLogin, helloprogram, login, deleteUser, display }