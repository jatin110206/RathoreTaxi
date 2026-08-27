const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model'); 

module.exports.registerCaptain = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        });
    }

    const {
        fullname: { firstname, lastname },
        email,
        password,
        vehicle: { color, plate, capacity, vehicleType }
    } = req.body;

    const existingCaptain = await captainService.findCaptainByEmail(email);

    if (existingCaptain) {
        return res.status(400).json({
            message: 'Captain with this email already exists'
        });
    }

    const hashPassword = await captainModel.hashPassword(password);

    const captain = await captainService.registerCaptain({
        firstname,
        lastname,
        email,
        password: hashPassword,
        color,
        plate,
        capacity,
        vehicleType
    });
    
    const token = captain.generateAuthToken();
    res.cookie('token', token);
    return res.status(201).json({
        token,
        captain
    });
}


module.exports.loginCaptain = async (req, res, next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.status(400).json({
            errors: error.array()
        });
    }

    const { email, password } = req.body;

    const captain=await captainModel.findOne({email}).select('+password');

    if (!captain) {
        return res.status(401).json({
            message: 'Captain not found'
        });
    }

    const isPasswordValid = await captain.comparePassword(password, captain.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: 'Invalid password'
        });
    }

    const token = captain.generateAuthToken();
    res.cookie('token', token);
    return res.status(200).json({
        token,
        captain
    });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({
        captain: req.captain
    });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization').split(' ')[1];
    
    if (!token) {
        return res.status(400).json({
            message: 'No token provided'
        });
    }

    await blacklistTokenModel.create({ token });
    res.clearCookie('token');
    return res.status(200).json({
        message: 'Logged out successfully'
    });
}