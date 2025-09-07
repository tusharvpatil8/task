import api from "./api";

export function addTask(data) {
    return api.post("user/add-task", data);
}

export const editTask = (id, data) => {
  return api.put(`/user/task/edit/${id}`, data);
};
export const getSingleTaskDetail = (id) => {
  return api.get(`/user/task/${id}`);
};

  export function getTasks(data) {
      return api.post("user/all-tasks", data);
  }

export const deleteTask = (id, data) => {
  return api.delete(`user/task/delete/${id}`, data);
};


export const updateTaskPublishedStatus = (id) => {
  return api.patch(`/user/task/status/${id}`);
};