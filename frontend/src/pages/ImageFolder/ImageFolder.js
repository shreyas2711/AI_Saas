import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Box, styled } from '@mui/material';
import './ImageFolder.css';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function ImageFolder() {
  const [savedImages, setSavedImages] = useState([]);

  const getSavedImages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/folder/show', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        withCredentials: true
      });
      console.log("response frontend:", response.data.response.rows);
      setSavedImages(response.data.response.rows);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSavedImages();
  }, []);

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); 
    } catch (error) {
      console.error('Error downloading the image:', error);
    }
  };
  

  return (
    <div>
      <h1>Saved Images</h1>
      <Box sx={{ marginTop: '5rem' }}>
        <Grid container spacing={3}>
          {savedImages.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box className='button-overlay'>
                <img
                  width={350}
                  height={300}
                  className="image"
                  src={item.image_url}
                  alt={`Image ${index}`}
                />
                <button
                  className="download-button"
                  onClick={() => handleDownload(item.image_url, `image_${index + 1}.jpg`)}
                >
                  <FileDownloadIcon />
                </button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}

export default ImageFolder;
