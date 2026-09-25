import api from "./api";

const BASE_URL = "/project-service/api/projects";

export const getAllProjects = () => {
  return api.get(BASE_URL);
};

export const getProjectById = (id) => {
  return api.get(`${BASE_URL}/${id}`);
};

export const createProject = (project) => {
  return api.post(BASE_URL, project);
};

export const updateProject = (id, project) => {
  return api.put(`${BASE_URL}/${id}`, project);
};

export const deleteProject = (id) => {
  return api.delete(`${BASE_URL}/${id}`);
};