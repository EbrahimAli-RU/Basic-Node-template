const express = require('express')
const app = express();
const morgan = require('morgan')
const cors = require('cors')
const bodyparser = require('body-parser')


app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'TESTING'
    })
})

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

module.exports = app;