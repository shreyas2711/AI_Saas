import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { enhance } from "@cloudinary/url-gen/actions/effect";
import { Cloudinary } from '@cloudinary/url-gen';
import { Loader } from 'rsuite';
import { styled, Typography } from '@mui/material';
import axios from 'axios';
import { Button, Modal, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { notification, Space } from 'antd';
import { sharpen } from '@cloudinary/url-gen/actions/adjust';
import { InputText } from 'primereact/inputtext';
import ImageResizer from 'react-image-file-resizer';
import Resizer from "react-image-file-resizer"; 
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

function ImageSharpen() {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const [cldResponse, setCldResponse] = useState(null);
  const [transformedURL, setTransformedURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userCredit, setUserCredit] = useState(null);
  const [minCredit, setMinCredit] = useState(false);
  const [loader,setLoader] = useState(false);
  const [value, setValue] = useState('');
  const [api, contextHolder] = notification.useNotification();
  const cld = new Cloudinary({ cloud: { cloudName: CLOUD_NAME } });

  const openNotification = (pauseOnHover) => () => {
    api.open({
      success:true,
      message: 'Image saved successfully!',
      showProgress: true,
      pauseOnHover,
    });
  };

  


  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // Create a URL for previewing the selected file
      setFile(URL.createObjectURL(selectedFile));

      // Resize the file after selection
      resizeFile(selectedFile);
    }
  };

  const resizeFile = (file) => {
    Resizer.imageFileResizer(
      file, // Pass the selected file
      610, // Width
      365, // Height
      "JPEG", // Format
      100, // Quality (0-100)
      0, // Rotation
      (resizedFile) => {
        console.log("Resized file:", resizedFile);
        uploadFile(resizedFile); 
      },
      "blob"
    );
  };

  const navigate = useNavigate();

  const handleNavigateUpgrade=()=>{

    navigate('/upgrade');
  }


  const uploadFile = async (file) => {
    if (!file) {
      console.error('Please select a file.');
      return;
}

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
  };

  const generateUniqueUploadId = () => {
    return `uqid-${Date.now()}`;
  };

  console.log("transform before:", transforming);
  const handleSendPrompt = async () =>  {
    try {
      const response = await axios.put(
       `${baseUrl}/api/user/transform`,
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

    console.log("transform after:", transforming);
    setIsLoading(true);
    setTransforming(true);
    if (cldResponse && cldResponse.public_id) {

      setLoader(true);
      const transformedImage = cld.image(cldResponse.public_id).adjust(sharpen().strength(value));

      const transformedURL = transformedImage.toURL();

   


      setTimeout(() => {
        setTransformedURL(transformedURL);
        setIsLoading(false);
        setTransforming(false);
        setLoader(false);
      }, 5000); // Simulate a 2-second transformation delay
    }
    else {
      setTransforming(false);
    }


  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const token = localStorage.getItem('token');
  const getUserDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/user/show`, {
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

  const handleFileChangeButton = () => {
    if (!minCredit) {
      setIsModalOpen(true);
    }
  }


  useEffect(() => {
    if (token) {
      getUserDetails();
    }
  }, [token]);

  const handleSaveImage = async () => {
    
    const saveImagePayload = {
      transformedURL: transformedURL,
    }
    try {
      const token = localStorage.getItem('token');
      const resp = await axios.post(`${baseUrl}/api/folder/save`, saveImagePayload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        withCredentials: true
      });
      openNotification(true)();
      console.log('Response:', resp.data);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {

    if (userCredit && userCredit.user_credit >= 2) {
      setMinCredit(true);
    }

  },[userCredit])

  console.log("transformed url:",transformedURL);
  return (
    <>

{contextHolder}

<Space>

</Space>
    
      {loader?
      <Spin fullscreen />
    :null}
      <div>
        <h1>Sharpen your image</h1>
      </div>
      <div style={{ marginTop: '5rem' }}>
      <div className="input-box">
          <InputText
            placeholder='Enter sharpen strength from range 0-200'
            style={{ width: '75rem',height:'40px',padding:'1rem' }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <CustomButton onClick={handleSendPrompt}>Send</CustomButton>
        </div>
        <div className="image-section" style={{ marginTop: '2rem' }}>
          <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={4} md={6} >
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
                    <label htmlFor="fileInput" style={{ cursor: 'pointer' }} onClick={handleFileChangeButton}>
                      <img
                        width={608}
                        height={362}
                        src="https://static.vecteezy.com/system/resources/previews/004/640/699/non_2x/circle-upload-icon-button-isolated-on-white-background-vector.jpg"
                        alt="Upload Placeholder"
                      />
                    </label>
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
          {uploading ?
            <Typography>
              Uploading
            </Typography> : null
          }
          <Modal open={isModalOpen} centered onOk={handleOk} onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>
              ,
              <Button onClick={handleNavigateUpgrade} type="primary">
                Upgrade
              </Button>
            ]}
          >
            <h4 style={{ color: '#f10909', fontWeight: '500' }}>Insufficient Credits!</h4>
            <ModalPTag>Your credits have been exhausted! Please recharge your credits for further image operations.</ModalPTag>
          </Modal>
        </div>
        <div className="upload-file" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3rem', flexDirection: 'column', gap: '1rem', marginRight: '2rem' }}>
          {/* <button onClick={uploadFile} disabled={uploading} style={{padding:'1rem',background:'blue',color:'white',width:'59rem',borderRadius:'30px',padding:'11px',}}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>  */}
          <button onClick={handleSaveImage} style={{ padding: '10px', background: uploadComplete ? '#3448c5' : '#8888e5', color: 'white', width: '59rem', borderRadius: '30px', border: '0', fontWeight: '500' }}>
            Save Image
          </button>
        </div>
      </div>
    </>
  );
}

export default ImageSharpen;
