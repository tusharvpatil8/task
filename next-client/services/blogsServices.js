import api from "./api";


export function getBlogs(data) {
    return api.post("user/all-blogs", data);
}

export function getBlogDetails(data) {
    return api.get(`user/blogs/${data}`);
}

export function getRelatedBlogs(param,data){
    return api.post(`user/all-related-blogs/${param}`,data);
}

export const updateBlogPublishedStatus = (id) => {
  return api.patch(`/admin/blog/status/${id}`);
};


export const deleteBlog = (id, data) => {
  return api.delete(`/admin/blog/delete/${id}`, data);
};

export const editBlog = (id, data) => {
  return api.put(`/admin/blog/edit/${id}`, data);
};


export const getSingleBlogDetail = (id) => {
  return api.get(`/admin/blog/${id}`);
};

export const getAllCategory = (status = "all", pageNo = 1, perPage = 10) => {
  return api.get(
    `/admin/categories/${status}?pageNo=${pageNo}&perPage=${perPage}`
  );
};


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