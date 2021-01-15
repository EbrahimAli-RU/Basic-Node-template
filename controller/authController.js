const jwt = require('jsonwebtoken')

const User = require('../model/user')
const catchAsync = require('../utils/catchAsync')
const appError = require('../utils/appError')
const sendMail = require('../utils/email')

const validateEmail = email => {
    return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)
}
const dataValidity = (userName, email, password, confirmPassword) => {
    if (!userName || !email || !password || !confirmPassword) {
        return {
            message: `All fields are required`,
            statusCode: 400
        }
    } else if (!validateEmail(email)) {
        return {
            message: `Not an email, please provide a valid one!`,
            statusCode: 400
        }
    } else if (password.length < 8) {
        return {
            message: `Password must be at least 8 charecter`,
            statusCode: 400
        }
    } else if (confirmPassword.length < 8) {
        return {
            message: `confirmPassword must be at least 8 charecter`,
            statusCode: 400
        }
    } else if (password !== confirmPassword) {
        return {
            message: `Password is not equal to confirmpassword`,
            statusCode: 400
        }
    } else {
        return false
    }

}

exports.register = catchAsync(async (req, res, next) => {

    const { userName, email, password, confirmPassword } = req.body
    const result = dataValidity(userName, email, password, confirmPassword)
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