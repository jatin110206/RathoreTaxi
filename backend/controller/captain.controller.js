const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
 

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
