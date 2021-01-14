const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: [true, `Username is required`]
    },
    email: {
        type: String,
        trim: true,
        required: [true, `Email is required`],
        unique: true,
    },
    password: {
        type: String,
        required: [true, `Password is required`],
        minlength: 8,
        maxlength: 20
    }
}, { timestamps: true })

const User = mongoose.model('user', userSchema)

module.exports = User