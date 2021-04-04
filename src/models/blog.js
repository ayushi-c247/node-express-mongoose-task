const mongoose = require('mongoose');

const BlogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60,
        trim: true
    },
    authorId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    body: {
        type: String,
        required: true,
        minlength: 24,
        maxlength: 13468,
        trim: true
    },
    posterimage: {
        type: String,
    },
    thumbnail: {
        type: String
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    flag: {
        type: Number,
        default: 0
    },
    // comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment"
    // }],
});

module.exports = mongoose.model('Blog', BlogSchema);