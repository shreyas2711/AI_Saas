import React, { useEffect, useState } from 'react';
import { useAuth } from "../AuthProvider";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBCollapse
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { Box } from '@mui/material';

export default function NavbarComponent() {
  const [openNavColor, setOpenNavColor] = useState(false);
  const [userCredit, setUserCredit] = useState(null);  // Initialize as null
  const auth = useAuth();
  
  const handleLogout = () => {
    auth.logOut();
  };

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

  return (
    <>
      <MDBNavbar expand='lg' dark bgColor='primary'>
        <MDBContainer fluid>
          <MDBNavbarBrand href='#'>Navbar</MDBNavbarBrand>
          <MDBNavbarToggler
            type='button'
            data-target='#navbarColor02'
            aria-controls='navbarColor02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setOpenNavColor(!openNavColor)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <div style={{ float: 'right' }}>
            <MDBCollapse open={openNavColor} navbar>
              <MDBNavbarNav className='me-auto mb-2 mb-lg-0'>
                <MDBNavbarItem className='active'>
                  <MDBNavbarLink aria-current='page' href='#'>
                    Home
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='#'>Features</MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  {token ? (
                    <MDBNavbarLink href='#' onClick={handleLogout}>
                      Logout
                    </MDBNavbarLink>
                  ) : (
                    <MDBNavbarLink href='/login'>Login</MDBNavbarLink>
                  )}
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink href='upgrade'>Upgrade</MDBNavbarLink>
                </MDBNavbarItem>
                {userCredit && (
                  <MDBNavbarItem style={{ marginTop: '7px' }}>
                  <Box sx={{display:'flex',gap:'3px'}}>
                  <MonetizationOnIcon />
                    <span style={{color:'#e9e9af'}}>{userCredit.user_credit}</span> {/* Render user credit */}
                  </Box>
                  </MDBNavbarItem>
                )}
              </MDBNavbarNav>
            </MDBCollapse>
          </div>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}
