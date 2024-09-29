const express = require('express');
const { UserSignUp, UserSignIn, getUsers, TransformUser } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();


module.exports=(db)=>{
    router.put('/user/transform',isAuthenticated(db),TransformUser(db));

    return router;
};




