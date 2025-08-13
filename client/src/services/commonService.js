import api from "./api";

export const uploadSingleImage = async (formData) => {
  try {
    const res = await api.post("/common/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("res.data",res)
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};