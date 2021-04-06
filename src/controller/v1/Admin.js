
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
    res.render("index.ejs", { emailerr: " ", passworderr: " ", emailValue: "", users: "", blog: "", comments: " ", totalBlogs: "", comment: "" });
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


        // const totalUser = await userModel.countDocuments();
        // var element = [];
        // var count = 0, sno;
        // for (let index = 0; index < users.length; index++) {
        //     sno = count++
        //     element.push(users[index]._id);
        // }
        const users = await userModel.find();
        const comments = await commentModel.find();
        const totalBlogs = await blogModel.find();
        console.log("totalblog", totalBlogs);
        const groupBlog = await blogModel.aggregate([
            {
                $group: {
                    _id: '$authorId',
                    blogid: { $addToSet: '$_id' },
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
                    count: {
                        $sum: 1,
                    },

                },
            },
        ])
        console.log(" groupComment", groupComment);
        res.render('dashbord.ejs', {
            users: users,
            blog: groupBlog,
            comments: comments,
            comment: groupComment,
            totalBlogs: totalBlogs,
        });
    } else {
        res.render('index.ejs', {
            emailValue: email,
            emailerr: emailerr,
            passworderr: passworderr,
        });
    }
}

// const deleteUser = async (req, res) => {
//     await userModel.findByIdAndRemove(req.params.id);
//     res.redirect("dash");
// }



//*******************User Status Update */

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

//********************** Delete User*/

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


// const deleteUser = async (req, res) => {
//     const id = req.params.id;
//     const blog = await blogModel.find({ authorId: id });
//     const comment = await commentModel.find({ userId: id });
//     const users = await userModel.findOne({ _id: id });
//     console.log("usr delete admin side", users);
//     if (users) {
//         if (blog.authorId == users._id);
//         await blogModel.deleteMany({ authorId: id });
//         //await commentModel.deleteMany({ userId: id });
//         await userModel.findByIdAndRemove(id);
//     }
//     res.redirect("../display");
// }



const display = async (req, res) => {
    const users = await userModel.find();
    const comments = await commentModel.find();
    const totalBlogs = await blogModel.find();
    const groupBlog = await blogModel.aggregate([
        {
            $group: {
                _id: '$authorId',
                blogid: { $addToSet: '$_id' },
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
    res.render('dashbord.ejs', {
        users: users,
        blog: groupBlog,
        comment: groupComment,
        totalBlogs: totalBlogs,
        comments: comments,
    });
}
module.exports = { adminLogin, helloprogram, login, deleteUser, display, userStatusUpdate }















// <% if(blog) { %>
//     <!-- for blog[0]._id===users[i]._id -->
//     <!-- for  blog.length-->

//     <% for(var j=0; j<blog.length; j++) { %>
//         <% if(blog[j]._id==users[i]._id) { %>

//             <% for(var k=0; k<blog[j].blogid.length; k++) { %>
//                 <%=blog[j].blogid[k]%>

//                     <% } %>
//                         <% } else {%>
//                             <% } %>
//                                 <% } %>
//                                     <% } %>
