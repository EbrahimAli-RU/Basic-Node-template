const User = require('../model/user')

exports.register = async (req, res) => {
    try {
        const newUser = await User.create(req.body)

        res.status(201).json({
            status: 'success',
            data: newUser
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            data: err
        })
    }
}