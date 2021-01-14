const express = require('express')
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const bodyparser = require('body-parser')

const authRouter = require('./router/user')

app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

// app.get('/', (req, res) => {
//     res.status(200).json({
//         message: 'TESTING'
//     })
// })

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

app.use('/api/v1/user', authRouter)

app.all(`*`, (req, res, next) => {
    // res.status(404).json({
    //     status: `fail`,
    //     message: `Can't find ${req.originalUrl} on this server`
    // })
    const err = new Error(`Can't find ${req.originalUrl} on this server`)
    err.statusCode = 404
    err.status = `fail`
    next(err)
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const status = err.status || 'error'
    res.status(statusCode).json({
        status,
        message: err.message
    })
    next()
})

module.exports = app;