const express = require('express')
const router = express.Router()

const authController = require('../controller/authController')

router.route('/register').post(authController.register);
router.post('/activation', authController.activation)
router.post('/signin', authController.signIn)
router.post('/forgotpassword', authController.forgotPassword)

module.exports = router