const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

//Connect Database
mongoose.connect('mongodb://localhost:27017/template', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log(`DB connect Successfully`)
}).catch(err => {
    console.log(err)
    console.log(`DB connection fail`)
});

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


