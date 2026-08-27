const express=require('express');
const router=express.Router();
const {body, validationResult}=require('express-validator');
const userController=require('../controller/user.controller');
const authMiddleware=require('../middlewares/auth.middlewares');



router.post('/register',[
    body('email').isEmail().withMessage('Invalid result'),
    body('fullname.firstname').isLength({min:3}).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({min:6}).withMessage('Password must be of 6 characters long')
],userController.registerUser)

router.post('/login',[
    body('email').isEmail().withMessage('invalid email'),
    body('password').isLength({min:6}).withMessage('your password should contains atleast 6 characters')
],userController.loginUser)

router.get('/profile',authMiddleware.authUser,userController.getUserProfile)

router.get('/logout',authMiddleware.authUser,userController.logoutUser);

module.exports=router;