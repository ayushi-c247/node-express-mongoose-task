const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
            maxLength: 255,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog",
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Comment", commentSchema);