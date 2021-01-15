const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: [true, `Username is required`],
    },
    email: {
        type: String,
        trim: true,
        required: [true, `Email is required`],
        validate: [validator.isEmail, 'Not an email, please provide correct email'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, `Password is required`],
        minlength: 8,
        maxlength: 20
    },
    confirmPassword: {
        type: String,
        required: [true, `Password is required`],
        minlength: 8,
        maxlength: 20,
        validate: {
            validator: function (value) {
                return this.password === value
            },
            message: 'Confirm password is not same as password'
        }
    }
}, { timestamps: true })


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined
    next();
})

const User = mongoose.model('user', userSchema)

module.exports = User