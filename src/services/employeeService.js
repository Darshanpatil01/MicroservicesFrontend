import api from "./api";

const BASE_URL = "/employee-service/api/employees";

export const getAllEmployees = () => {
  return api.get(BASE_URL);
};

export const getEmployeeById = (id) => {
  return api.get(`${BASE_URL}/${id}`);
};

export const createEmployee = (employee) => {
  return api.post(BASE_URL, employee);
};

export const updateEmployee = (id, employee) => {
  return api.put(`${BASE_URL}/${id}`, employee);
};

export const deleteEmployee = (id) => {
  return api.delete(`${BASE_URL}/${id}`);
};