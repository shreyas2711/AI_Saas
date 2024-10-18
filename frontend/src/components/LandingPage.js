import React, { useEffect, useRef } from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import { Box, styled, Typography } from "@mui/material";
import '../App.css'
import './LandingPage.css'
import CloudVideo from "../Video/CloudVideo.webm"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from "react-router-dom";

const SideGreenHeading = styled('span')({
    color:'#90dbb5',
    fontWeight:'500',
    fontSize:'18px',
    fontFamily:'sans-serif'
})
const SideGreenHeadingForWhite = styled('span')({
    color:'#90dbb5',
    fontWeight:'600',
    fontSize:'18px',
    fontFamily:'sans-serif'
})

const SideHeadingBold = styled('h1')({
    color:'white',
    fontSize:'45px',
    fontWeight:'600',
})
const SideSpan = styled('span')({
    color:'white',
    fontSize:'16px',
})


const Container2Span1 = styled('span')({
  color:'white',
  fontSize:'40px',


})
const Container2Span222 = styled('span')({
  color:'#afadad',
  fontSize:'21px',


})

const BoldHeadingForContainer3Black = styled('span')({
  color:'black',
  fontSize:'18px',
  fontWeight:'600'
})

const Container3ContentSpan = styled('span')({
  color:'black',
  fontSize:'15px',
  fontFamily:'sans-serif'
})

const TryNowLink  = styled('span')({

    color:'#3367e3',
    fontWeight:'600',
    fontSize:'21px',
    cursor:'pointer'

})


const Container3Span1 = styled('span')({
  color:'black',
  fontSize:'33px',
  fontWeight:'600',
})


const myStyle = {
  backgroundImage:
      "url('https://img.freepik.com/free-photo/design-space-paper-textured-background_53876-32191.jpg')",
  marginTop: "-70px",
  fontSize: "50px",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  opacity:'1'
};
const myStyle2 = {
  backgroundImage:
      "url('https://img.freepik.com/free-vector/white-color-background-gradient-abstract-modern_343694-2130.jpg')",

  fontSize: "50px",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};



const LandingPage = () => {
  const videoEl = useRef(null);

  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch(error => {
        console.error("Error attempting to play", error);
      });
  };
  
  useEffect(() => {
    attemptPlay();
  }, []);
  return (
    <div className="home-container">
      <Navbar />
    <div className="home-banner-container-1">
    <Box sx={{display:'flex',padding:'5rem',gap:'9rem',marginLeft:'17rem'}}>
    <Box sx={{width:'40%'}}>
    <SideGreenHeading className="my-4">
        Artificial Intelligence
    </SideGreenHeading>
    <SideHeadingBold className="my-4">
    Turn every customer interaction into a unique customer experience
    </SideHeadingBold>
    <SideSpan>
    Segment makes it easier than ever to understand, predict, and generate 1:1 customer engagement in real time and at scale. 
    </SideSpan>
    </Box>
    <Box>
      <img width={500} height={450} src="https://segment.com/content/dam/segment/global/en/solutions/ai/illo-hero-AI-segment-ink.png/_jcr_content/renditions/compressed-original.webp" alt="" />
    </Box>
    </Box>
    </div>

    <div className="home-container-2" style={myStyle}>
    <Box sx={{display:'flex',padding:'10rem',gap:'4rem',marginLeft:'10rem'}}>
      <Box sx={{width:'40%'}}>
        <Container2Span1>
        AI-Powered Image & Video Transformation at Scale
        </Container2Span1>
        <br />
        <Typography style={{color:'#afadad',fontSize:'21px'}}>
        Transform your image and video workflows with Cloudinary’s Generative, LLM, and Content-Aware AI features.
        </Typography>
       <Link to="/login"> <TryNowLink>
          Try Now <ArrowForwardIcon/>
        </TryNowLink>
        </Link>
      </Box>
      <Box>
        <img src="https://cloudinary-marketing-res.cloudinary.com/image/upload/c_scale,w_900/e_loop,f_avif,fl_animated.aavif/Cld_Homepage_AI_tab_v5_tsp" alt="" />
      </Box>
    </Box>
    </div>

    <div className="home-container-3 my-4">
      <Box sx={{display:'flex'}}>
        <Box sx={{padding:'3rem 6rem 3rem 19rem',width:'50%'}}>
        <Box className="my-1">
        <SideGreenHeadingForWhite>
        Generative AI
       </SideGreenHeadingForWhite>
        </Box>
          <Container3Span1>
          Create the most relevant customer experiences in minutes
          </Container3Span1>

          <div className="my-4">
            <BoldHeadingForContainer3Black >
            CustomerAI Generative Audiences
            </BoldHeadingForContainer3Black>

            <Typography className="my-2">
            Launch campaigns faster by describing the specific audience you want to reach in a simple text box, then let Segment automatically create that audience for you in minutes.
            </Typography>
          </div>

          <div className="my-4">
            <BoldHeadingForContainer3Black >
         CustomerAI Generative Email & Journeys
            </BoldHeadingForContainer3Black>

            <Typography className="my-2">
            Coming soon: Spend less time building, writing, and designing campaigns and journeys and more time delivering the most personalized experience to every customer.
            </Typography>
          </div>

        </Box>
        <Box>
        <video
          style={{ maxWidth: "100%", width: "800px", margin: "0 auto" }}
          playsInline
          loop
          muted
          alt="All the devices"
          src={CloudVideo}
          ref={videoEl}
        />
        </Box>
      </Box>
    </div>

    </div> 
  );
};

export default LandingPage;