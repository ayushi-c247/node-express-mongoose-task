const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema(
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
        blogId:  { 
            type: Schema.Types.ObjectId, ref: 'Blog' ,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Comment", commentSchema);