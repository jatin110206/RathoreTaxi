const userModel=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const blacklistTokenModel=require('../models/blacklistToken.model');

module.exports.authUser=async(req,res,next)=>{
    const token=req.cookies.token || req.header('Authorization').split(' ')[1];
    if(!token){
        return res.status(401).json({
            message:'Access denied. No token provided'
        });
    }

    const isBlacklisted=await blacklistTokenModel.findOne({token:token});
    if(isBlacklisted){
        return res.status(401).json({
            message:'Token is blacklisted. Please login again'
        });
    }


    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        req.user = user;

        return next();

    }
    catch(err){
        return res.status(400).json({
            message:'Invalid token'
        });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    try {
        let token;

        // Check cookie
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // Check Authorization header
        else if (req.headers.authorization) {
            const authHeader = req.headers.authorization;

            if (!authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    message: 'Invalid Authorization header'
                });
            }

            token = authHeader.split(' ')[1];
        }

        // No token
        if (!token) {
            return res.status(401).json({
                message: 'Access denied. No token provided'
            });
        }

        // Check blacklist
        const isBlacklisted = await blacklistTokenModel.findOne({
            token: token
        });

        if (isBlacklisted) {
            return res.status(401).json({
                message: 'Token is blacklisted. Please login again'
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find captain
        const captainModel = require('../models/captain.model');

        const captain = await captainModel.findById(decoded._id);

        if (!captain) {
            return res.status(401).json({
                message: 'Captain not found'
            });
        }

        // Attach captain to request
        req.captain = captain;

        next();

    } catch (err) {
        console.log(err);

        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}; 