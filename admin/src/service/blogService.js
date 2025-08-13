import api from "service/api";

export function addBlog(data) {
  return api.post("/admin/add-blog", data);
}

export const getAllBlogs = (data) => {
  return api.post(`/admin/blog-list`, data);
};

export const deleteBlog = (id, data) => {
  return api.delete(`/admin/blog/delete/${id}`, data);
};

export const editBlog = (id, data) => {
  return api.put(`/admin/blog/edit/${id}`, data);
};

export const updateBlogPublishedStatus = (id) => {
  return api.patch(`/admin/blog/status/${id}`);
};
export const getSingleBlogDetail = (id) => {
  return api.get(`/admin/blog/${id}`);
};
