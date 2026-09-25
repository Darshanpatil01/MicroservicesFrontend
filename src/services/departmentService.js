import api from "./api";

const BASE_URL = "/department-service/api/departments";

export const getAllDepartments = () => {
  return api.get(BASE_URL);
};

export const getDepartmentById = (id) => {
  return api.get(`${BASE_URL}/${id}`);
};

export const createDepartment = (department) => {
  return api.post(BASE_URL, department);
};

export const updateDepartment = (id, department) => {
  return api.put(`${BASE_URL}/${id}`, department);
};

export const deleteDepartment = (id) => {
  return api.delete(`${BASE_URL}/${id}`);
};