const moment = require("moment");
const { validationResult } = require("express-validator");

const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const message = require("../../utils/constant");


//Add Blog */
const userBlog = async (req, res) => {
    console.log("i am inside user blog");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    try {
        const { title, body, } = req.body;
        const posterImage = req.files.posterImage[0];
        var thumbnailImage = req.files.thumbnailImage.map(file => file.path);

        console.log("treq.files", posterImage);
        console.log("my thumbnail path", thumbnailImage);
        console.log("my thumbnailimage", JSON.stringify(thumbnailImage));
        let newblog = await blogModel.create({
            posterimage: posterImage.path,
            thumbnail: JSON.stringify(thumbnailImage),
            title,
            body,
            authorId: req.user.id,
            createdAt: moment(Date.now()).format()
        })
        console.log("blog data", newblog);
        return res.json({ status: message.STATUS_BLOG_SUCCESS, userdata: newblog, });
    }
    catch (error) {
        console.log("Add blog catch =", error);
        return res.status(500).json({ error: message.ADD_BLOG_CATCH });
    }
};


//View All Blogs of particular user */
const viewAllBlog = async (req, res) => {
    try {
        const allBlog = await blogModel.find();
        res.status(200).json({ message: message.VIEW_ALL_BLOG, allBlog: allBlog })
    } catch (error) {
        console.log("view all blog catch =", error);
        return res.status(500).json({ error: message.VIEW_ALL_BLOG_CATCH, });
    }
}


//View Particular User's Blogs */
const viewUserBlog = async (req, res) => {
    try {
        const findUserBlog = await blogModel.find({ authorId: req.user.id })
        if (findUserBlog) {
            return res.status(200).json({ message: message.VIEW_USER_BLOG, findUserBlog })
        }
        return res.status(200).json({ message: message.NO_USER_BLOG, })
    } catch (error) {
        console.log("view user blog catch =", error);
        return res.status(500).json({ error: message.VIEW_USER_BLOG_CATCH, allBlog });
    }
}


//Update blog */
const updateBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, body } = req.body;
        const findAllBlog = await blogModel.findOne({ authorId: req.user.id, _id: id })
        console.log("findAllBlog", findAllBlog);
        if (findAllBlog) {
            console.log("findAllBlogcdndsjfsdjfhsdjfhsdjfhsdjfsbdhjsdghsgsdhgsdjhhjb",);
            console.log("req.files", req.files);
            const posterImage = req.files && req.files.posterImage && req.files.posterImage.length && req.files.posterImage[0] && req.files.posterImage[0].path ? req.files.posterImage[0].path : null;
            // const thumbnailImage = req.files && req.files.thumbnailImage && req.files.thumbnailImage.length ? req.files.thumbnailImage.map(file => file.path) : null;
            const thumbnailImage = req.files && req.files.thumbnailImage && req.files.thumbnailImage.length && req.files.thumbnailImage.map(file => file) && req.files.thumbnailImage.map(file => file.path) ? req.files.thumbnailImage.map(file => file.path) : null;
            const thumbnail = JSON.stringify(thumbnailImage)
            const thumbnailStringify = JSON.stringify(JSON.parse(findAllBlog.thumbnail));
            console.log(" thumbnailStringify", thumbnailStringify);
            console.log(" thumbnail)", thumbnail);

            var updateData = {
                title: title ? title : findAllBlog.title,
                body: body ? body : findAllBlog.body ? findAllBlog.body : '',
                posterimage: posterImage ? posterImage : findAllBlog.posterimage ? findAllBlog.posterimage : '',
                thumbnail: thumbnail ? thumbnail : thumbnailStringify ? thumbnailStringify : ''
            }
            await blogModel.updateOne({ _id: id }, { $set: updateData }, { new: true });
            return res.status(200).send({ message: message.BLOG_UPDATE, updateData });
        }
        else {
            return res.status(500).send({ message: message.BLOG_UPDATE_FAILD, });
        }
    } catch (error) {
        console.log("update blog catch =", error);
        return res.status(400).send({ error: message.UPDATEBLOG_CATCH });
    }
};


//Delete one Blog of particular user */
const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(" req params", req.params);
        const findAllBlog = await blogModel.findOne({ authorId: req.user.id, _id: id })
        if (findAllBlog) {
            let deleteDocs = findAllBlog._id
            await blogModel.deleteOne({ _id: deleteDocs })
            return res.status(400).send({ message: message.DELETE_BLOG_SUCCESS });
        }
        return res.status(400).send({ error: message.BLOG_ID_NOT_FOUND });
    } catch (error) {
        console.log("delete all blogs catch=", error);
        return res.status(400).send({ error: message.DELETE_BLOG_CATCH });
    }
};


// Delete all blogs of particular user */
const deleteAllBlogs = async (req, res) => {
    try {
        const blogId = await blogModel.find({ authorId: req.user.id });
        await blogModel.deleteMany(blogId);
        return res.status(400).send({ message: message.DELETE_BLOG_SUCSESS });
    } catch (e) {
        console.log("error", e);
        return res.status(400).send({ error: message.DELETE_BLOG_CATCH });
    }
};


// apply lookup and populate to show users details with its blogs and comments
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
        const blogdata = await blogModel.find({ authorId: req.user.id })
        const userblogadata = await userModel.findById({ _id: req.user.id })
        userblogadata.blogs.splice(blogdata);
        for (let index = 0; index < blogdata.length; index++) {
            userblogadata.blogs.push(blogdata[index]);
        }
        //lookup
        const blog = await blogModel.aggregate([
            {
                $lookup: {
                    from: "comments",
                    as: "Comments",
                    foreignField: "id",
                    localField: "blogId"
                }
            },
        ])
        await userblogadata.save()
        //populate
        const userblogadataa = await userModel.findById({ _id: req.user.id }).populate("blogs").exec()
        console.log("userblogadataaass", userblogadataa, blog);
        return res.status(200).json({
            userAndBlogData: userblogadataa, blog
        });

    } catch (error) {
        console.log("userAndBlog", error);
        return res.status(500).json({ error: message.DELETE_IMAGE_ERROR_MESSAGE });
    }
}

//likes dislikes
const likesDislikes = async (req, res) => {
    try {
        const { likes, dislikes, id } = req.body
        const blogdata = await blogModel.find({ _id: id });
        if (likes == 'true') {
            blogdata.likes++
        }
        else if (likes == 'false') {
            blogdata.likes++;
        }
        else if (dislikes == "false") {
            blogdata.dislikes--;
            blogdata.likes--;
        }
        let updatedData = {
            likes: blogdata.likes,
            dislikes: blogdata.dislikes
        }
        await blogModel.updateOne({ _id: id }, updatedData, function (err, result) {
            if (err) {
                return res.status(500).json({ error: message.LIKES_DISLIKES_ERR });
            } else {
                return res.status(200).json({ error: message.LIKES_DISLIKES_SUCCESS });
            }
        })
    } catch (error) {
        console.log("userAndBlog", error);
        return res.status(500).json({ error: message.LIKES_DISLIKES_ERROR });
    }
}

// Module exports
module.exports = { userBlog, viewAllBlog, viewUserBlog, updateBlog, deleteBlog, deleteAllBlogs, userAndBlog, likesDislikes }







