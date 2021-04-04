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
             type:String,
        //  ref: "User",
        },
        blogId:  { 
            type:String, ref: 'Blog' ,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Comment", commentSchema);