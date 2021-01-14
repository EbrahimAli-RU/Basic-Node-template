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
    res.status(404).json({
        status: `fail`,
        message: `Can't find ${req.originalUrl} on this server`
    })
    next()
})

module.exports = app;