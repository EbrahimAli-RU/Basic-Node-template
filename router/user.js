const express = require('express')
const router = express.Router()

const authController = require('../controller/authController')

router.route('/register').post(authController.register);

module.exports = router