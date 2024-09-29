const express = require('express');
const { UserSignUp, UserSignIn } = require('../controllers/authController');
const { saveImageInFolder, getFolder } = require('../controllers/folderController');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router();

module.exports = (db) => {
    router.post('/folder/save', isAuthenticated(db), saveImageInFolder(db));
    router.get('/folder/show', isAuthenticated(db), getFolder(db));
    return router;
};
