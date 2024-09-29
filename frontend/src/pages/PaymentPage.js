import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import useRazorpay from "react-razorpay";
import axios from 'axios';
import { Box, styled } from '@mui/material';


const CustomButton = styled('button')({
  background:'#3448c5',
  borderRadius:'4px',
  color:'white',
  padding:'4px 5px 5px 5px',
  fontWeight:'500',
  fontFamily:'inherit',
  fontSize:'13px',
  border:'0'
})


const CardInfoDiv = styled('div')({
  marginLeft:'0rem'
})


const ButtonDiv = styled('div')({

  marginLeft:'-2rem'
})


function PaymentPage() {

  const [Razorpay] = useRazorpay();
  const RAZORPAY_KEY_ID = 'rzp_test_2Q9vl4rExNYOIC';
  console.log("key:",RAZORPAY_KEY_ID) 

  const handlePayment = async (PayValue) => {
    try {
      const token = localStorage.getItem('token');
  
      // Send the POST request
      // const amount = {
      //   amount_pay:1000
      // }
      const response = await axios.post("http://localhost:4000/api/payment/order",{amount:PayValue},{
         // Pass an empty object for the body if not needed
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          withCredentials: true
  
    });
  
      // Access the parsed JSON data directly from response.data
      const order = response.data;
      console.log("Order:", order);
      console.log("resp:", response);
  
      // Set up Razorpay options with the received order details
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Shreyas", // Your company details
        description: "Payment for your order", // Add order details
        order_id: order.id, // Razorpay order ID
  
        handler: async (response) => {
          try {
            await axios.post("https://ai-saas-5z18.onrender.com/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount:order.amount,
            }, {                   
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              withCredentials: true
            });
  
            alert("Payment successful!");
            window.location.reload();
          } catch (err) {
            alert("Payment failed: " + err.message);
          }
        },
  
        prefill: {
          name: "Shreyas Kamath", // Customer details
          email: "shreyas.kamath27@gmail.com", // Customer email
          contact: "9611622445", // Customer contact
        },
  
        theme: {
          color: "#3399cc", // Customize the payment gateway color
        },
      };
  
      // Open Razorpay payment window
      const rzpay = new Razorpay(options);
      rzpay.open();
    } catch (err) {
      alert("Error creating order: " + err.message);
    }
  };
  

  return (
   
    <Box>
       <h1>Upgrade Plan</h1>
    <div style={{display:'flex',gap:'5rem',marginTop:'4rem'}}>
      <Card>
      <CardContent>
      <div>
      <h1>Plus</h1> 
      <p style={{width:'19rem'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, excepturi?</p>
      <h1>₹99</h1>
      <span>Per month</span>
      </div>
      <ButtonDiv>
      <CustomButton onClick={()=>handlePayment(9900)} style={{marginTop:'2rem',marginLeft:'2rem'}}>Select Plan</CustomButton>
      </ButtonDiv>
      </CardContent>
      </Card>
      <Card>
      <CardContent>
      <div>
      <h1>Advanced</h1> 
      <p style={{width:'19rem'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, excepturi?</p>
      <h1>₹199</h1>
      <span>Per month</span>
      </div>
      <ButtonDiv>
      <CustomButton onClick={()=>handlePayment(19900)} style={{marginTop:'2rem',marginLeft:'2rem'}}>Select Plan</CustomButton>
      </ButtonDiv>
      </CardContent>
      </Card>
      <Card>
      <CardContent>
      <div>
      <h1>Advanced Extra</h1> 
      <p style={{width:'19rem'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, excepturi?</p>
      <h1>₹299</h1>
      <span>Per month</span>
      </div>
      <ButtonDiv>
      <CustomButton onClick={()=>handlePayment(29900)} style={{marginTop:'2rem',marginLeft:'2rem'}}>Select Plan</CustomButton>
      </ButtonDiv>
      </CardContent>
      </Card>
    </div>
    </Box>
  )
}

export default PaymentPage;
