// const { body, validationResult } = require("express-validator");

const blogModel = require("../../models/blog");
const userModel = require("../../models/user");
const message = require("../../utils/constant");
const commentModel = require("../../models/comment");


//Add Comments */
const addComment = async (req, res) => {
    try {
        const { body, blogId, } = req.body;
        //const user = await userModel.findById({ _id: req.user.id });
        const findBlog = await blogModel.findOne({ _id: blogId })
        if (findBlog) {
            if (req.user.id == findBlog.authorId) {
                return res.status(404).json({ error: message.DO_NOT_COMMENT });
            } else {
                let newComment = await commentModel.create({
                    userId: req.user.id,
                    blogId: blogId,
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


// View All Comments of particular users   */
const viewAllComment = async (req, res) => {
    try {
        const getAllComments = await commentModel.find({ userId: req.user.id }); // Give proper name to variable
        return res.status(200).json({ message: message.VIEW_ALL_COMMENT, getAllComments });
    } catch (error) {
        console.log("View all comment catch =", error);
        return res.status(500).json({ error: message.VIEW_ALL_COMMENT_CATCH });
    }
}

//View all comments of particular blog of that user */ ///pendinggggggggggggggggg
const viewBlogComment = async (req, res) => {
    try {
        const blog_id = req.params.id;
        const getBlogComments = await commentModel.find({ userId: req.user.id, blogId: blog_id });
        console.log("getBlogComments", getBlogComments);
        if (getBlogComments !== null) {
            return res.status(200).json({ message: message.VIEW_BLOG_COMMENT, getBlogComments });
        }
        else {
            return res.status(500).json({ message: message.BLOG_ID_INCOORECT, });
        }
    } catch (error) {
        console.log("View blog comment catch =", error);
        return res.status(500).json({ error: message.VIEW_BLOG_COMMENT_CATCH });
    }
}


//*********************** Update Comment */
const updateComment = async (req, res) => {
    try {
        const id = req.params.id;
        const { body } = req.body
        const findComment = await commentModel.findOne({ userId: req.user.id, _id: id });
        if (findComment) {
            const updateComment = {
                body: body ? body : id.body
            }
            const updatedComment = await commentModel.findByIdAndUpdate({ _id: id }, updateComment)
            return res.status(200).json({ message: message.UPDATE_COMMENT, updatedComment });
        }
        else {
            return res.status(500).json({ error: message.UPDATE_COMMENT_FAILD });
        }
    } catch (error) {
        console.log("update comment catch =", error);
        return res.status(500).json({ error: message.UPDATE_COMMENT_CATCH });
    }
}


//Delete one comment of blog of particular user */
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id
        const findCommentId = await commentModel.findOne({ userId: req.user.id, _id: commentId });
        if (findCommentId) {
            await commentModel.deleteOne({ _id: commentId });
            return res.status(200).json({ message: message.DELETE_COMMENT_SUCCESS, });
        } else {
            return res.status(500).json({ error: message.DELETE_COMMENT_FAILD });
        }
    } catch (error) {
        console.log("delete comment catch =", error);
        return res.status(500).json({ error: message.DELETE_COMMENT_CATCH });
    }

}




module.exports = { addComment, viewAllComment, deleteComment, updateComment, viewBlogComment }