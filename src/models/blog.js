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
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    body: {
        type: String,
        minlength: 24,
        maxlength: 13468,
        trim: true,
        required: true,
    },
    posterimage: {
        type: String,
    },
    thumbnail: {
        type: Array,
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
});

module.exports = mongoose.model('Blog', BlogSchema);