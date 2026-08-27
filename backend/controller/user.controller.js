const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');


module.exports.registerUser = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        });
    }

    const {
        fullname: { firstname, lastname },
        email,
        password
    } = req.body;

    const hashPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname,
        lastname,
        email,
        password: hashPassword
    });

    const token = user.generateAuthToken();

    return res.status(201).json({
        token,
        user
    });
};

module.exports.loginUser = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        });
    }

    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);

    if (!user) {
        return res.status(401).json({
            message: 'User not found'
        });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: 'Invalid password'
        });
    }

    const token = user.generateAuthToken();
    res.cookie('token', token);
    return res.status(200).json({
        token,
        user
    });
};

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json({
        user: req.user
    });
};


module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.header('Authorization').split(' ')[1];
    if (!token) {
        return res.status(400).json({
            message: 'No token provided'
        });
    }

    const blacklistToken = new (require('../models/blacklistToken.model'))({
        token
    });

    await blacklistToken.save();
    return res.status(200).json({
        message: 'User logged out successfully'
    });
}