const jwt = require('jsonwebtoken')

const User = require('../model/user')
const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')
const sendMail = require('../utils/email')
const { dataValidity, validateEmail } = require('../utils/validity')
exports.register = catchAsync(async (req, res, next) => {

    const { userName, email, password, confirmPassword } = req.body
    const result = dataValidity(userName.trim(), email.trim(), password.trim(), confirmPassword.trim())
    if (result) {
        return next(new appError(result.message, result.statusCode))
    }
    const user = await User.findOne({ email })
    if (user) {
        return next(new appError(`This email is already exist, please try another one`, 400))
    }
    const token = await jwt.sign({
        userName,
        email,
        password,
        confirmPassword
    }, process.env.PRIVATE_KEY, { expiresIn: '15m' })
    const activationUrl = `${process.env.CLIENT_URL}/user/activation/${token}`
    await sendMail({
        url: activationUrl
    })
    res.status(200).json({
        status: 'success',
        message: `Send an Email to ${email}`
    })
})

exports.activation = catchAsync(async (req, res, next) => {
    const { activationToken } = req.body
    jwt.verify(activationToken, process.env.PRIVATE_KEY, async function (err, decoded) {
        if (err) {
            switch (err.name) {
                case 'TokenExpiredError':
                    return next(new appError(`This token is no longer valid`, 400))
                // case ''
            }
        } else {
            const newUser = await User.create({
                userName: decoded.userName,
                email: decoded.email,
                password: decoded.password,
                confirmPassword: decoded.confirmPassword
            })

            res.status(201).json({
                status: 'success',
                user: newUser
            })

        }
    });
})