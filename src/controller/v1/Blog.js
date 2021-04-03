const moment = require("moment");
const { body, validationResult } = require("express-validator");
const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const message = require("../../utils/constant");
const commentModel = require("../../models/comment");

//************** Add Blog */


const userBlog = async (req, res) => {
    console.log("i am inside user blog");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    try {
        const userId = await userModel.find({ _id: req.user.id });
        console.log("userId", userId);
        if (userId === null) {
            return res.status(500).json({ error: message.USER_NOT_EXITS });
        }
        const { title, body, } = req.body;
        const posterImage = req.files.posterImage[0];
        var thumbnailImage = req.files.thumbnailImage.map(file => file.path);

        console.log("treq.files", posterImage);
        console.log("my thumbnail path", thumbnailImage);
        console.log("my thumbnailimage", JSON.stringify(thumbnailImage));
        // const thumbnail = async (req, res) => {
        //     const photo = await jimp.read(file2[0].path);
        //     console.log(photo);
        // await photo.resize(1200, jimp.AUTO);
        // await photo.write(`./uploads/thumbnail${(req.body.photo[i])}`)
        // }
        //     req.body.thumbnail = thumbnail;
        let newblog = await blogModel.create({
            posterimage: posterImage.path,
            thumbnail: JSON.stringify(thumbnailImage),
            title,
            body,
            authorId: req.user.id,
            createdAt: moment(Date.now()).format()
        })
        //var newblog = new blogModel(blogdata);
        console.log("blog data", newblog);
        return res.json({ status: message.STATUS_BLOG_SUCCESS, userdata: newblog, });
    }
    catch (error) {
        console.log("Add blog catch =", error);
        return res.status(500).json({ error: message.ADD_BLOG_CATCH });
    }
};



//*********************************View All Blogs */

const viewAllBlog = async (req, res) => {
    try {
        const userId = await userModel.find({ _id: req.user.id });
        console.log("userId", userId);
        if (userId === null) {
            return res.status(500).json({ error: message.USER_NOT_EXITS });
        }
        const allBlog = await blogModel.find();
        res.status(200).json({ message: message.VIEW_ALL_BLOG, allBlog: allBlog })
    } catch (error) {
        console.log("view all blog catch =", error);
        return res.status(500).json({ error: message.VIEW_ALL_BLOG_CATCH, });
    }
}

//************************View Particular User's Blogs */

const viewUserBlog = async (req, res) => {
    try {
        const userId = await userModel.find({ _id: req.user.id });
        console.log("userId", userId);
        if (userId === null) {
            return res.status(500).json({ error: message.USER_NOT_EXITS });
        }
        const findUserBlog = await blogModel.find({ authorId: req.user.id })
        return res.status(200).json({ message: message.VIEW_USER_BLOG, findUserBlog })

    } catch (error) {
        console.log("view user blog catch =", error);
        return res.status(500).json({ error: message.VIEW_USER_BLOG_CATCH, allBlog });
    }
}

//******************** Update blog */

const updateBlog = async (req, res) => {
    try {
        const userId = await userModel.find({ _id: req.user.id });
        console.log("userId", userId);
        if (userId === null) {
            return res.status(500).json({ error: message.USER_NOT_EXITS });
        }
        const id = req.params.id;
        const { title, body } = req.body;
        const findAllBlog = await blogModel.find({ authorId: req.user.id })
        for (i = 0; i < findAllBlog.length; i++) {
            //console.log("forrrrr", findAllBlog[i]);
            if (findAllBlog[i]._id == id) {
                console.log("ifffffff");
                const blogId = findAllBlog[i];
                console.log("blogId", blogId);
                console.log("req.files", req.files);
                const posterImage = req.files && req.files.posterImage && req.files.posterImage.length && req.files.posterImage[0] && req.files.posterImage[0].path ? req.files.posterImage[0].path : null;
                // const thumbnailImage = req.files && req.files.thumbnailImage && req.files.thumbnailImage.length ? req.files.thumbnailImage.map(file => file.path) : null;
                const thumbnailImage = req.files && req.files.thumbnailImage && req.files.thumbnailImage.length && req.files.thumbnailImage.map(file => file) && req.files.thumbnailImage.map(file => file.path) ? req.files.thumbnailImage.map(file => file.path) : null;


                // const thumbnail = JSON.stringify(thumbnailImage);
                const thumbnail = JSON.stringify(thumbnailImage)
                const thumbnailStringify = JSON.stringify(JSON.parse(blogId.thumbnail));
                console.log(" thumbnailStringify", thumbnailStringify);
                console.log(" thumbnail)", thumbnail);



                var updateData = {
                    title: title ? title : blogId.title,
                    // title: title ? title : blogId.title ? blogId.title : '',
                    body: body ? body : blogId.body ? blogId.body : '',
                    posterimage: posterImage ? posterImage : blogId.posterimage ? blogId.posterimage : '',
                    thumbnail: thumbnail ? thumbnail : thumbnailStringify ? thumbnailStringify : ''
                }
                await blogModel.updateOne({ _id: id }, { $set: updateData }, { new: true });
                return res.status(200).send({ message: message.BLOG_UPDATE, updateData });
            }
        }
        //const blogId = await blogModel.findOne({ _id: id });


    } catch (error) {
        console.log("update blog catch =", error);
        return res.status(400).send({ error: message.UPDATEBLOG_CATCH });
    }
};

//******************************* Delete one Blog */

const deleteBlog = async (req, res) => {

    try {
        const userId = await userModel.find({ _id: req.user.id });
        console.log("userId", userId);
        if (userId === null) {
            return res.status(500).json({ error: message.USER_NOT_EXITS });
        }
        const id = req.params.id;
        console.log(" req params", req.params);
        const findAllBlog = await blogModel.find({ authorId: req.user.id })
        //console.log("all blogs in delete api", findAllBlog);
        //console.log("findAllBlog.length", findAllBlog.length);
        for (i = 0; i < findAllBlog.length; i++) {
            // console.log("forrrrr", findAllBlog[i]);
            if (findAllBlog[i]._id == id) {
                //console.log("ifffffff");
                let deleteDocs = findAllBlog[i]._id
                await blogModel.deleteOne({ _id: deleteDocs })
                return res.status(400).send({ message: message.DELETE_BLOG_SUCCESS });

            }
        }
        return res.status(400).send({ error: message.BLOG_ID_NOT_FOUND });
    } catch (error) {
        console.log("delete all blogs catch=", error);
        return res.status(400).send({ error: message.DELETE_BLOG_CATCH });
    }
};

//*********************************** Delete all blogs of particular user */

const deleteAllBlogs = async (req, res) => {

    try {
        const userId = await userModel.find({ _id: req.user.id });
        console.log("userId", userId);
        if (userId === null) {
            return res.status(500).json({ error: message.USER_NOT_EXITS });
        }
        const blogId = await blogModel.findOne({ authorId: req.user.id });
        console.log("delete blogid", blogId);
        await blogModel.deleteMany(blogId);
        return res.status(400).send({ message: message.DELETE_BLOG_SUCSESS });
    } catch (e) {
        console.log("error", e);
        return res.status(400).send({ error: message.DELETE_BLOG_CATCH });
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
        const blogdata = await blogModel.find({ authorId: req.user.id })
        console.log("blogdata", blogdata);
        const userblogadata = await userModel.findById({ _id: req.user.id })
        console.log("i m here one");
        userblogadata.blogs.splice(blogdata);
        for (let index = 0; index < blogdata.length; index++) {
            userblogadata.blogs.push(blogdata[index]);
        }

        console.log("i m here gfht");
        await userblogadata.save()

        // const addcomment= await commentModel.find()
        //  console.log("addcomment",addcomment);
        //  for (let index = 0; index < addcomment.length; index++) {
        // userblogadata.comments.push(addcomment[index]);
        //  }
        // await  blogdataa.save()


        const userblogadataa = await userModel.findById({ _id: req.user.id }).populate("blogs").exec()
        //await blogModel.find({ authorId: req.user.id }).populate({ path: "blogs", populate: {path: "comments" 
        //       }
        //    })
        console.log("userblogadataaass", userblogadataa);
        return res.status(200).json({
            userAndBlogData: userblogadataa
        });



        // //comments
        //  const commentData = await commentModel.find({blogId:blogdata._id});
        //   const blogdataa = await blogModel.find({ authorId: req.user.id });

        //  console.log("commentData",commentData);
        //  for(var i=0;i<commentData.length;i++){
        //      for(var j=i;j<commentData.length;j++){
        //      if (commentData[i].userId == blogdata[j].authorId) { // && commentData[i].blogId == blogdata[j]._id
        //          const myCommentData= await blogModel.find({authorId:commentData.userId})
        //         // myCommentData.comments.splice(commentData);
        // for (let index = 0; index < commentData.length; index++) {
        //     myCommentData.comments.push(commentData[index]);
        // }
        // console.log("i m in comment if");
        // await myCommentData.save()
        //      }
        //  }
        //  }


        //const userblogadataa = await userModel.findById({ _id: req.user.id }).populate({ path: "blogs", populate: { path: "comments" }}).exec();


        //  return res.status(200).json({
        //    userblogadataa: userblogadataa
        // });
        //end comments



    } catch (error) {
        console.log("userAndBlog", error);
        return res.status(500).json({ error: message.DELETE_IMAGE_ERROR_MESSAGE });
    }
}
// Module exports
module.exports = { userBlog, viewAllBlog, viewUserBlog, updateBlog, deleteBlog, deleteAllBlogs, userAndBlog }













// const data = await UserModel.aggregate([
//     {
//       $addFields: {
//         fullName: {
//           $concat: ['$firstName', ' ', '$lastName'],
//         },
//       },
//     },

//     {
//       $lookup: {
//         from: 'subadmins',
//         as: 'subadmin',
//         foreignField: 'userId',
//         localField: '_id',
//       },
//     },

//     {
//       $unwind: '$subadmin',
//     },
//     {
//       $match: condition,
//     },
//     {
//       $project: {
//         firstName: 1,
//         lastName: 1,
//         middleName: 1,
//         fullName: 1,
//         email: 1,
//         phoneNumber: 1,
//         status: 1,
//         subAdminDetails: '$subadmin',
//       },
//     },
//     { $sort: { _id: -1 } }, // Use this to sort documents by newest first
//     { $skip: skip }, // Always apply 'skip' before 'limit'
//     { $limit: limit }, // This is your 'page size'
//   ]);

// const result = await UserModel.update(
//     {
//       _id: id,
//     },
//     {
//       $set: {
//         password: encryptPassword(password.trim()),
//         emailVerified: true,
//         verifyToken: '',
//       },
//     }
//   );

//   const result = await UserModel.updateOne(
//     {
//       _id: id,
//       email,
//       verifyToken,
//     },
//     {
//       $set: {
//         password: encryptedPassword,
//         verifyToken: '',
//       },
//     },
//     {
//       new: true,
//     }
//   );

//   const userData = await UserModel.findOne(
//     {
//       _id: id,
//       email,
//     },
//     {
//       password: 1,
//       emailVerified: 1,
//     }
//   );