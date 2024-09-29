const express = require('express');
const { isAuthenticated } = require('../middleware/auth');
const { createPaymentOrder, verifyPaymentOrder } = require('../controllers/orderController');
const router = express.Router();


module.exports=(db)=>{
    router.post('/payment/order',isAuthenticated(db),createPaymentOrder(db));
    router.post('/payment/verify',isAuthenticated(db),verifyPaymentOrder(db));
    return router;
};




