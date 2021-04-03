
const { body, validationResult } = require("express-validator");
const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const message = require("../../utils/constant");
const commentModel = require("../../models/comment");


//****************** Add Comments */
const addComment = async (req, res) => {
    try {
        console.log("req.user.id",req.user.id);
        const user = await userModel.findById({_id:req.user.id});
        console.log("In addcomment ", user);
        if (!user) {
            return res.status(200).json({
                message: message.USER_NOT_EXITS,
            });
        }

        const { body, blogId, } = req.body;
        const findBlog = await blogModel.find({ _id: blogId })
        if (findBlog) {
            if (req.user.id == findBlog[0].authorId) {
                return res.status(404).json({ error: message.DO_NOT_COMMENT });
            } else {
                let newComment = await commentModel.create({
                    userId: req.user.id,
                    blogId,
                    body
                });
                console.log("my comments", newComment);
    
                return res.status(200).json({ status: message.STATUS_COMMENT_SUCCESS, userdata: newComment, });
            }
        } else {
            return res.status(500).json({ error: message.ADD_COMMENT_FAILD });
        }
    } catch (error) {
        console.log("Add comment catch =", error);
        return res.status(500).json({ error: message.ADD_BLOG_CATCH });
    }
}


//********* View All Comments */
const viewAllComment = async (req, res) => {
    try {
        const userId = await userModel.find({ _id: req.user.id });
        console.log("userId", userId);
        if (userId === null) {
            return res.status(500).json({ error: message.USER_NOT_EXITS });
        }
        const getComments = await commentModel.find();
        return res.status(200).json({ message: message.VIEW_ALL_COMMENT, comments: getComments });
    } catch (error) {
        console.log("View all comment catch =", error);
        return res.status(500).json({ error: message.VIEW_ALL_COMMENT_CATCH });
    }
}



//************* View Blog Wise Comments */
const viewBlogComment = async (req, res) => {
    try {
        const userId = await userModel.find({ _id: req.user.id });
        console.log("userId", userId);
        if (userId === null) {
            return res.status(500).json({ error: message.USER_NOT_EXITS });
        }
        const blogId = req.params.id
        const getBlogComments = await commentModel.find({ blogId });
        return res.status(200).json({ message: message.VIEW_BLOG_COMMENT, BlogComments: getBlogComments });
    } catch (error) {
        console.log("View blog comment catch =", error);
        return res.status(500).json({ error: message.VIEW_BLOG_COMMENT_CATCH });
    }

}


//*********************** Update Comment */
const updateComment = async (req, res) => {

    try {
        const userId = await userModel.find({ _id: req.user.id });
        console.log("userId", userId);
        if (userId === null) {
            return res.status(500).json({ error: message.USER_NOT_EXITS });
        }
        const id = req.params.id
        const { body } = req.body
        const blog = await blogModel.find();
        if (req.user.id == blogId.authorId) {
        }
        const updateComment = {
            body: body ? body : id.body
        }
        const updatedComment = await commentModel.findOneAndUpdate({ _id: id }, updateComment)
        return res.status(200).json({ message: message.UPDATE_COMMENT, updatedComment });

    } catch (error) {
        console.log("update comment catch =", error);
        return res.status(500).json({ error: message.UPDATE_COMMENT_CATCH });
    }
}


//****************************Delete Comment */
const deleteComment = async (res, req) => { }


//***************** Delete Blog-wise All Comments  */
const deleteAllComment = async (res, req) => { }

module.exports = { addComment, viewAllComment, deleteComment, updateComment, deleteAllComment, viewBlogComment }