import { Box, Card, CardContent, styled } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function UserDashboard() {

  const navigate = useNavigate();
  const [userCredit, setUserCredit] = useState(null);
  const CreditUsage=styled('span')({
      fontSize:'22px',
      color:'black',

      
  })

  const token = localStorage.getItem('token');
  console.log("token:", token);  

  const getUserDetails = async () => {
    try {
      const response = await axios.get('https://ai-saas-5z18.onrender.com/api/user/show', {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        withCredentials: true
      });
      setUserCredit(response.data.user.rows[0]);  // Assuming you only want the first user's data
      console.log('user:', response.data.user.rows[0]);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (token) {
      getUserDetails();
    }
  }, [token]);

  const CreditUsageValue=styled('span')({
    fontSize:'21px',
    color:'black',
    fontWeight:'500'
  })

  const handleNavigateUpgradePlan=()=>{
    navigate('/userDetail/upgrade')
  }

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
  return (
    <div>
    <h1>Dashboard</h1>
    <Box sx={{display:'flex',gap:'5rem',padding:'5rem 15rem 10rem'}}>
    <Box>
    <Card style={{width:'30rem'}}>
    <CardContent>
      <Box sx={{display:'flex',gap:'17rem'}}>
      <Box>
      <CreditUsage >
        Credit Usage
      </CreditUsage>
      </Box>
      <Box>
      {userCredit && (
      <CreditUsageValue>
     
      {userCredit.user_credit}
      </CreditUsageValue>
    )}
      </Box>
      </Box>
    </CardContent>
    </Card>
    </Box>
    <Box>
    <Card style={{width:'30rem'}}>
    <CardContent>
      <Box sx={{display:'flex',gap:'18rem'}}>
      <Box>
      <CreditUsage >
        Free
      </CreditUsage>
      </Box>
      <Box sx={{marginTop:'5px'}}>
      <CustomButton onClick={handleNavigateUpgradePlan}>Upgrade Plan</CustomButton>
      </Box>
      </Box>
    </CardContent>
    </Card>
    </Box>
    </Box>
    </div>
  )
}

export default UserDashboard
