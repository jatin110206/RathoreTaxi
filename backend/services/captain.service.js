const captainModel = require('../models/captain.model');    

module.exports.registerCaptain = async ({
    firstname,
    lastname,
    email,
    password,
    color,
    plate,
    capacity,
    vehicleType
}) => {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }
    const captain = await captainModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    });

    return captain;
}

module.exports.findCaptainByEmail = async (email) => {
    const captain = await captainModel
        .findOne({ email })
        .select('+password');

    return captain;
}