import { useState } from 'react';

// Set your cloud name and unsigned upload preset here:
const CLOUD_NAME = 'dobkdjc1k';
const UPLOAD_PRESET = 'new_preset';

const Chunked = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [cldResponse, setCldResponse] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async () => {
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

      console.log(
        `Uploading chunk for uniqueUploadId: ${uniqueUploadId}; start: ${start}, end: ${
          end - 1
        }`
      );


   

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
          console.info('File upload complete.');
          console.log("respo:",fetchResponse.url);
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

  return (
    <>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadComplete && cldResponse && (
        <div>
          <img width={500} height={300} src={cldResponse.url} alt="" />
        </div>
      )}
    </>
  );
};

export default Chunked;
