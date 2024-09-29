import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { generativeRemove } from "@cloudinary/url-gen/actions/effect";
import { Cloudinary } from '@cloudinary/url-gen';
import { Loader } from 'rsuite';
import { styled, Typography } from '@mui/material';
import axios from 'axios';
import { Button, Modal, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

const CLOUD_NAME = 'dobkdjc1k';
const UPLOAD_PRESET = 'new_preset';

const ModalPTag = styled('p')({
  color:'red'
})

const CustomButton = styled('button')({
  background:'#3448c5',
  borderRadius:'4px',
  color:'white',
  padding:'5px 7px 5px 7px',
  fontWeight:'500',
  fontFamily:'inherit',
  fontSize:'13px',
  border:'0',
  marginLeft:'1rem'
})

function RemoveObjects() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [cldResponse, setCldResponse] = useState(null);
  const [value, setValue] = useState('');
  const [transformedURL, setTransformedURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minCredit, setMinCredit] = useState(false);
  const [userCredit, setUserCredit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader,setLoader] = useState(false);
  const cld = new Cloudinary({ cloud: { cloudName: CLOUD_NAME } });

  const handleFileChange = (event) => {
    if (minCredit) {
      const selectedFile = event.target.files[0];
      setFile(URL.createObjectURL(selectedFile));

      uploadFile(selectedFile);
    }
  };

const navigate = useNavigate();


const handleNavigateUpgrade=()=>{

  navigate('/upgrade');
}

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleFileChangeButton = () => {
    if (!minCredit) {
      setIsModalOpen(true);
    }
  }

  const uploadFile = async (file) => {
    if (!file) {
      console.error('Please select a file.');
      return;
    }

    if (minCredit) {


      const uniqueUploadId = generateUniqueUploadId();
      const chunkSize = 5 * 1024 * 1024;
      const totalChunks = Math.ceil(file.size / chunkSize);
      let currentChunk = 0;

      setUploading(true);

      const uploadChunk = async (start, end) => {
        const formData = new FormData();
        formData.append('file', file.slice(start, end));
        formData.append('cloud_name', CLOUD_NAME);
        formData.append('upload_preset', UPLOAD_PRESET);
        const contentRange = `bytes ${start}-${end - 1}/${file.size}`;

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
            {
              method: 'POST',
              body: formData,
              headers: {
                'X-Unique-Upload-Id': uniqueUploadId,
                'Content-Range': contentRange,
              },
            }
          );

          if (!response.ok) {
            throw new Error('Chunk upload failed.');
          }

          currentChunk++;

          if (currentChunk < totalChunks) {
            const nextStart = currentChunk * chunkSize;
            const nextEnd = Math.min(nextStart + chunkSize, file.size);
            uploadChunk(nextStart, nextEnd);
          } else {
            setUploadComplete(true);
            setUploading(false);

            const fetchResponse = await response.json();
            setCldResponse(fetchResponse);
          }
        } catch (error) {
          console.error('Error uploading chunk:', error);
          setUploading(false);
        }
      };

      const start = 0;
      const end = Math.min(chunkSize, file.size);
      uploadChunk(start, end);
    }
  }

  console.log("uploading", uploading);
  console.log("uploadComplete", uploadComplete);
  console.log("cldResponse", cldResponse);
  console.log("minCredit", minCredit);
  const generateUniqueUploadId = () => {
    return `uqid-${Date.now()}`;
  };

  const token = localStorage.getItem('token');

  const handleSendPrompt = async () => {
    try {
      const response = await axios.put(
        'http://localhost:4000/api/user/transform',
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      console.log("Response:", response);
    } catch (error) {
      console.error("Error during transformation:", error);
    }

    setIsLoading(true);
    setLoader(true);
    if (cldResponse && cldResponse.public_id) {
      const transformedImage = cld.image(cldResponse.public_id).effect(
        generativeRemove().prompt(value)
      );

      const transformedURL = transformedImage.toURL();
      setTimeout(() => {
        setTransformedURL(transformedURL);
        if (transformedURL) {
          setIsLoading(false);
          setLoader(false);
        }
      }, 5000); // Simulate a 2-second transformation delay
    }
  };




  const getUserDetails = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/show', {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      setUserCredit(response.data.user.rows[0]);
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

  useEffect(() => {

    if (userCredit && userCredit.user_credit >= 2) {
      setMinCredit(true);
    }

  })

  return (
    <>
    {loader?
      <Spin fullscreen />
    :null}
      <div>
        <h1>Remove object from image</h1>
      </div>
      <div style={{ marginTop: '5rem' }}>
        <div className="input-box">
          <InputText
            style={{ width: '75rem' }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <CustomButton onClick={handleSendPrompt}>Send</CustomButton>
        </div>
        <div className="image-section" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }} columnSpacing={2}>
            <Grid item xs={2} md={6}>
              <h1>Original</h1>
              <div style={{ position: 'relative', width: '610px', height: '365px', border: '1px solid grey' }}>
                {uploadComplete && cldResponse && minCredit ? (
                  <img src={cldResponse.url} width={610} height={365} alt="Uploaded" />

                ) : (
                  <>
                    {minCredit ? (


                      <input
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="fileInput"
                      />
                    ) : null}
                    <label htmlFor="fileInput" style={{ cursor: 'pointer' }} onClick={handleFileChangeButton} >
                      <img
                        width={608}
                        height={363}
                        src="https://static.vecteezy.com/system/resources/previews/004/640/699/non_2x/circle-upload-icon-button-isolated-on-white-background-vector.jpg"
                        alt="Upload Placeholder"
                      />
                    </label>
                    {uploading ?
                      <Typography>
                        Uploading
                      </Typography> : null
                    }
                  </>
                )}
              </div>
            </Grid>
            <Grid item xs={4} md={6}>
          
              <h1>Transformed</h1>
              <div style={{ position: 'relative', width: '610px', height: '365px', border: '1px solid grey' }}>
                {isLoading ? (
                  <Loader />
                ) : (
                  transformedURL && <img src={transformedURL} width={610} height={365} alt="Transformed" />
                )}
              </div>

            </Grid>
          </Grid>
          {/* {uploading ?
            <Typography>
              Uploading
            </Typography> : null
          } */}
          <Modal  open={isModalOpen} centered   onOk={handleOk} onCancel={handleCancel} 
          footer={[  
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>
          ,
          <Button  onClick={handleNavigateUpgrade} type="primary">
            Upgrade
          </Button>
          ]}
          >
          <h4 style={{color:'#f10909',fontWeight:'500'}}>Insufficient Credits!</h4>
            <ModalPTag>Your credits have been exhausted! Please recharge your credits for further image operations.</ModalPTag>
          </Modal>
        </div>
      </div>

    </>
  );
}

export default RemoveObjects;
