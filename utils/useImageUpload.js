import { useState } from 'react';
import axios from 'axios';

export const useImageUpload = (userId) => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/v1/image/uploadFile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data && response.data.file) {
        const imageUrl = response.data.file.url;

        const updateResponse = await axios.put(
          `/api/v1/profile/updateImage/${userId}`,
          { imageUrl },
        );
        if (updateResponse.data && updateResponse.data.status === 200) {
          setUploadedImage(imageUrl);
        }
      }
    } catch (error) {
      error;
    }
  };

  return { uploadedImage, handleImageUpload };
};
