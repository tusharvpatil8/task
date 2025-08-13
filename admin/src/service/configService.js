import api from "./api";

// Categories

export const addCategory = (data) => {
  return api.post(`/admin/category`, data);
};

export const updateCategory = (id, data) => {
  return api.put(`/admin/category/${id}`, data);
};

export const deleteCategory = (id, data) => {
  return api.delete(`/admin/category/${id}`, data);
};

export const toggleCategoryStatus = (id, data) => {
  return api.put(`/admin/category/inactivate/${id}`, data);
};

export const getAllCategory = (status = "all", pageNo = 1, perPage = 10) => {
  return api.get(
    `/admin/categories/${status}?pageNo=${pageNo}&perPage=${perPage}`
  );
};
