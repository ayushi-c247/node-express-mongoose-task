const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");
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
        const isMatch = await bcrypt.compareSync(password, admin.password);
        console.log("ismatch", isMatch);
        if (!isMatch) {
            return res.status(400).json({
                message: message.PASSWORD
            });
        } else {
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

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: message.LOGIN_ERROR_MESSAGE });
    }
};




//show user details by admin  
const homePage = async (req, res) => {
    res.render("index.ejs", { emailValue: "", emailerr: " ", passworderr: " ", emailValue: "", users: "", blog: "", comments: " ", totalBlogs: "", comment: "", blogByComment: "" });
}


//login admin
const login = async (req, res) => {
    var flag = 0;

    const { email, password } = req.body;
    var response = {
        email: email,
        password: password,
    };
    var adminDetail = await adminModel.findOne({ email: email });
    console.log("admin deatails ", adminDetail);
    console.log("response =:", response);
    if (email == "" && password == "") {
        var emailerr = "Please Enter Email";
        var passworderr = "Please Enter Password";
        console.log("please Enter Email");
        flag = 1;
    }
    else if (adminDetail == null) {
        var emailerr = "Please Enter correct Email";
        var passworderr = "Please Enter Password";
        console.log("please Enter Email");
        flag = 1;
    }
    else if (password == "") {
        var passworderr = "Please Enter Password";
        console.log("please enter password");
        flag = 1;
    }
    else if (email == null) {
        flag = 1;
        var emailValue = "Please enter correct email";

    }
    if (flag == 1) {
        res.render('index.ejs', {
            emailValue: emailValue,
            emailerr: emailerr,
            passworderr: passworderr,
        });
    }
    const isMatch = await bcrypt.compareSync(password, adminDetail.password);
    console.log("ismatch", isMatch);
    if (isMatch) {
        res.redirect(`${process.env.hostPath}v1/admin/adminDashboard`);
    } else {
        res.render('index.ejs', {
            emailValue: response.email,
            emailerr: "",
            passworderr: "Please enter correct password",
        });
    }
}



//User Status Update */
const userStatusUpdate = async (req, res) => {

    const id = req.params.id;
    const user = await userModel.findById({ _id: id })
    if (user.status === "Inactive") {
        var statusUpdate = {
            status: 'Active'
        }
        await userModel.updateOne({ _id: id }, statusUpdate, function (err, change) {
            if (err) {
                res.json({
                    error: messages.UPDATE_USER_ADMIN_ERROR,
                });
            }
        });
        res.redirect("../display");
    } else {
        if (user.status === "Active") {
            var statusUpdate = {
                status: 'Inactive'
            }
            await userModel.updateOne({ _id: id }, statusUpdate, function (err, change) {
                if (err) {
                    res.json({
                        error: customMessage.Messages.UPDATE_USER_ADMIN_ERROR,
                    });
                }
            });
            res.redirect("../display");
        }
    }
}


// Delete User*/
const deleteUser = async (req, res) => {
    const id = req.params.id;
    const blog = await blogModel.find({ authorId: id });
    const users = await userModel.findOne({ _id: id });
    console.log("usr delete admin side", users);
    if (users) {
        if (blog.authorId == users._id);
        await blogModel.deleteMany({ authorId: id });

        await commentModel.deleteMany({ userId: id });
        await userModel.findByIdAndRemove(id);
    }
    res.redirect("../display");
}


//Display data*/
const display = async (req, res) => {
    const users = await userModel.find();
    const comments = await commentModel.countDocuments();
    const totalBlogs = await blogModel.countDocuments();
    const groupBlog = await blogModel.aggregate([
        {
            $group: {
                _id: '$authorId',
                blogid: { $addToSet: '$title' },
                count: {
                    $sum: 1,
                },

            },
        },
    ])
    const groupComment = await commentModel.aggregate([
        {
            $group: {
                _id: '$userId',
                commentid: { $addToSet: '$_id' },
                count: {
                    $sum: 1,
                },

            },
        },
    ])
    const groupCommentByBlog = await commentModel.aggregate([
        {
            $group: {
                _id: '$blogId',
                commentid: { $addToSet: '$_id' },
                userId: { $addToSet: '$userId' },
                count: {
                    $sum: 1,
                },

            },
        },
    ])
    res.render('dashbord.ejs', {
        users: users,
        blog: groupBlog,
        comment: groupComment,
        totalBlogs: totalBlogs,
        comments: comments,
        blogByComment: groupCommentByBlog,
    });
}



//admin Dashboard */
const adminDashboard = async (req, res) => {
    const users = await userModel.find();
    const comments = await commentModel.countDocuments();
    const totalBlogs = await blogModel.countDocuments();
    console.log("totalblog", totalBlogs);
    const groupBlog = await blogModel.aggregate([
        {
            $group: {
                _id: '$authorId',
                blogid: { $addToSet: '$title' },
                mainId: { $addToSet: '$_id' },
                count: {
                    $sum: 1,
                },

            },
        },
    ])
    console.log(" groupBlog", groupBlog);
    const groupComment = await commentModel.aggregate([
        {
            $group: {
                _id: '$userId',
                commentid: { $addToSet: '$_id' },
                body: { $addToSet: '$body' },
                count: {
                    $sum: 1,
                },
            },
        },
    ])
    //**************bolg wise comments
    const groupCommentByBlog = await commentModel.aggregate([
        {
            $group: {
                _id: '$blogId',
                commentid: { $addToSet: '$_id' },
                userId: { $addToSet: '$userId' },
                count: {
                    $sum: 1,
                },

            },
        },
    ])
    console.log("groupCommentByBlog", groupCommentByBlog);
    //**************** */
    console.log(" groupComment", groupComment);
    res.render('dashbord.ejs', {
        users: users,
        blog: groupBlog,
        comments: comments,
        comment: groupComment,
        totalBlogs: totalBlogs,
        blogByComment: groupCommentByBlog
    });
}


module.exports = { adminLogin, homePage, login, deleteUser, display, userStatusUpdate, adminDashboard }















