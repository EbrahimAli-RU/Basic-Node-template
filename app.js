const express = require('express')
const app = express();
const morgan = require('morgan')
const cors = require('cors')

if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

app.use(cors())


module.exports = app;