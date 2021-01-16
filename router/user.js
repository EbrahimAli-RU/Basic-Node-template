const express = require('express')
const router = express.Router()

const authController = require('../controller/authController')

router.route('/register').post(authController.register);
router.post('/activation', authController.activation)
router.post('/signin', authController.signIn)
router.post('/forgotpassword', authController.forgotPassword)
router.patch('/resetpassword', authController.resetPassword)
router.get('/', authController.protected, authController.getAllUsers)

module.exports = router