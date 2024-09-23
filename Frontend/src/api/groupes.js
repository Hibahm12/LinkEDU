import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
export const getProfesseurGroup = (groupeId) => api.get(`/groupes/${groupeId}/professeur`);

export const getMembersGroup = (groupeId) => api.get(`/groupes/${groupeId}`);



// export const updateTask = (taskId, data) => api.put(`/tasks/${taskId}`, data);
// export const createTask = (groupeId,data) => api.post(`/groupes/${groupeId}/tasks`, data);
// export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);