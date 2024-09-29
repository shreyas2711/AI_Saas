const express = require('express');
const { UserSignUp, UserSignIn, getUsers, TransformUser } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();


module.exports=(db)=>{
    router.post('/user/signin',UserSignIn(db));
    router.post('/user/signup',UserSignUp(db));
    // router.get('/user/signout',UserLogOut(db));
    router.get('/user/show',getUsers(db));
    router.put('/user/transform',isAuthenticated(db),TransformUser(db));

    return router;
};




