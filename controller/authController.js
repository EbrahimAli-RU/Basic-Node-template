const jwt = require('jsonwebtoken')

const User = require('../model/user')
const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')
const sendMail = require('../utils/email')

exports.register = catchAsync(async (req, res, next) => {

    const { userName, email, password, confirmPassword } = req.body
    const user = await User.findOne({ email })
    if (user) {
        return next(new appError(`This email is already exist, please try another one`, 400))
    }
    const token = await jwt.sign({
        userName,
        email,
        password,
        confirmPassword
    }, process.env.PRIVATE_KEY, { expiresIn: 100 })
    const activationUrl = `${process.env.CLIENT_URL}/user/activation/${token}`
    await sendMail({
        url: activationUrl
    })
    res.status(200).json({
        status: 'success',
        message: `Send an Email to ${email}`
    })

    // next()
})

exports.activation = catchAsync(async (req, res, next) => {
    console.log("EBRAHIM")
    const { activationToken } = req.body
    const decoded = await jwt.verify(activationToken, process.env.PRIVATE_KEY);
    console.log(decoded)
    // const newUser = await User.create({
    //     userName: decoded.userName,
    //     email: decoded.email,
    //     password: decoded.password,
    //     confirmPassword: decoded.confirmPassword
    // })

    res.status(201).json({
        status: 'success',
        user: newUser
    })
})