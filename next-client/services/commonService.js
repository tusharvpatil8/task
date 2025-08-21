// import api from "./api";

// export const uploadSingleImage = async (formData) => {
//   try {
//     const res = await api.post("/common/image", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     console.log("res.data",res)
//     return res.data;
//   } catch (err) {
//     throw err.response?.data || err;
//   }
// };

import api from "./api";

// ✅ Handles single image upload
export const uploadSingleImage = async (formData) => {
  try {
    const res = await api.post("/common/image", formData, {
      headers: {
        // ❌ Don't manually set Content-Type for FormData
        // Axios will set it automatically with boundary
      },
    });
    console.log("Image Upload Response:", res);
    return res;
  } catch (err) {
    throw err.response?.data || err;
  }
};
