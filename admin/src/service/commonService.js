import api from './api';

export const addSingleProductImage = (formData) => {
  return api.post(`common/image`, formData);
};

// export const uploadSingleImage = (imageFile) => {
//   const imageDate = new FormData();
//   imageDate.append('image', imageFile);
//   return api.post('common/image', imageDate);
// };

export const uploadSingleImage = async (formData) => {
  try {
    const res = await api.post("/common/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("res.data",res.data)
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// service/commonService.js

export const uploadMultiImage = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await api.post('common/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Image Upload Response:', response.data);

    if (response?.data?.length > 0) {
      return {
        success: true,
        data: response.data,
      };
    } else {
      throw new Error(response.data.message || 'Image upload failed');
    }
  } catch (error) {
    console.error('Error uploading images:', error.message);
    return {
      success: false,
      message: error.message || 'Image upload failed',
    };
  }
};
