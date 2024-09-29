const jwt = require("jsonwebtoken");
const ErrorResponse = require('../utils/ErrorResponse');
const db = require('../index');


// exports.isAuthenticated =(db)=> async(req,res,next)=>{
//     console.log("Cookies:", req.cookies);
//     const { token } = req.cookies; 
//    console.log("cookie token:",token);

// // req.user = await db.one(query, params);

//     if(!token){
//         return next(new ErrorResponse("Not authorized to access this route",401));
//     }
//     try{

//         const decoded = jwt.verify(token,'sdsdasdasdasjsdsad');
//         console.log("This is decoded:",decoded);
//         console.log("Decoded id:",decoded.userId);
//         req.user = await db.query('SELECT * FROM users WHERE user_id=$1',[decoded.userId]);
//         console.log("Req user is:",req.user)
//         next();
//     }
//     catch (error) {
//         console.error('Error in isAuthenticated middleware:', error);
//         return res.status(401).json({ success: false, error: 'Unauthorized' });
//     }
// }

exports.isAuthenticated = (db) => async (req, res, next) => {
    let token;

    // Check Authorization header for Bearer token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If no token is found, respond with unauthorized
    if (!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sdsdasdasdasjsdsad');
        req.user = await db.query('SELECT * FROM users WHERE user_id=$1', [decoded.userId]);
        next();
    } catch (error) {
        console.error('Error in isAuthenticated middleware:', error);
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
};