const appError = require('../utils/appError')

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: `Something went wrong`,
        })
    }
}

const handleMongoDuplicateKeyError = (err) => {
    let dubKeyValuePair = Object.entries(err.keyValue)[0]
    let message = `Duplicate value ${dubKeyValuePair[0]}: ${dubKeyValuePair[1]}`

    return new appError(message, 400)
}

const handleMongoValidatorError = err => {
    return new appError(err.message, 400)
}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV === 'production') {
        if (err.code === 11000) err = handleMongoDuplicateKeyError(err)
        if (err.name === 'ValidationError') err = handleMongoValidatorError(err)

        sendErrorProd(err, res)
    }
    next()
}