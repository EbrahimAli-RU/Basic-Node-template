const jwt = require('jsonwebtoken')

const User = require('../model/user')
const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')
const sendMail = require('../utils/email')
const { dataValidity, validateEmail } = require('../utils/validity')


const signToken = id => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE })
}

exports.register = catchAsync(async (req, res, next) => {
    const { userName, email, password, confirmPassword } = req.body
    const result = dataValidity(userName.trim(), email.trim().toLowerCase(), password.trim(), confirmPassword.trim())
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
                case 'JsonWebTokenError':
                    return next(new appError(`Not a Valid Token`, 400))
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

exports.signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new appError(`Please provide email and password`, 400))
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.checkPassword(password, user.password))) {
        return next(new appError(`Invalid email or password`))
    }

    res.status(200).json({
        status: 'success',
        data: {
            user: user._id,
            token: signToken(user._id)
        },
        message: `Logged in Successfully!`
    })
})