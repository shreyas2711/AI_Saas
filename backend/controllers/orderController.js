const Razorpay = require("razorpay");
require("dotenv").config();
const crypto = require("crypto");


exports.createPaymentOrder = (db)=>async(req,res)=>{


    console.log('keyyy:',process.env.RAZORPAY_KEY_ID);
    try {
        const {amount} = req.body;
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });
        const options = {
            amount: amount, 
            currency: "INR",
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        };
        const order = await instance.orders.create(options);  
        console.log("order:",order);
        if (!order) return res.status(500).send("Some error occured"); 
       
        res.status(200).json(order);
       
}                          
catch (error) {
    res.status(500).send(error);
}
}


exports.verifyPaymentOrder =(db)=>async (req,res)=>{
    console.log("Verify order:");
    
    try{
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature,amount } = req.body;
        const user_id = req.user.rows[0].user_id;
        console.log("user_id:",user_id);
        console.log("razorpay_order_id:",razorpay_order_id); 
        console.log("razorpay_payment_id:",razorpay_payment_id); 
        console.log("razorpay_signature:",razorpay_signature); 
        console.log("amount_paid:",amount); 
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        console.log("sign:",sign);
        const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(sign.toString()).digest('hex'); 
            console.log("razorpay_signature:",razorpay_signature);
            console.log("expectedSign:",expectedSign);
            if (razorpay_signature === expectedSign) {
                // Payment is verified
                console.log("Payment verified successfully")
                res.status(200).json({ message: 'Payment verified successfully' });
                switch (amount) {
                    case 9900:
                        const response1 = await db.query('UPDATE users SET user_credit = user_credit + 10 WHERE user_id=$1',[user_id]);
                        break;
                    case 19900:
                        const response2 = await db.query('UPDATE users SET user_credit = user_credit + 20 WHERE user_id=$1',[user_id]);
                        break;
                    case 29900:
                        const response3 = await db.query('UPDATE users SET user_credit = user_credit + 30 WHERE user_id=$1',[user_id]);
                        break;
                    default:
                        break;
                }
            } else {
                console.log("Invalid payment signature")
                res.status(400).json({ error: 'Invalid payment signature' });
            }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}