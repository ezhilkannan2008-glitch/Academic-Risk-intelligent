import axios from 'axios';

const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

export const getRiskAnalysis = async () => {
  const response = await api.get('/risk-analysis');
  return response.data;
};

export const getCourseDetail = async (id) => {
  const response = await api.get(`/course/${id}`);
  return response.data;
};

export const login = async (username, password) => {
  const response = await api.post('/api/auth/login', { username, password });
  return response.data;
};

export const signup = async (username, password) => {
  const response = await api.post('/api/auth/signup', { username, password });
  return response.data;
};
export const addMarks = async (data) => {
  const response = await api.post('/marks', data);
  return response.data;
};

// Notification APIs
export const getNotifications = async (role) => {
  const params = role ? { role } : {};
  const response = await api.get('/api/notifications', { params });
  return response.data;
};

export const generateNotifications = async () => {
  const response = await api.post('/api/notifications/generate');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.patch(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async (role) => {
  const params = role ? { role } : {};
  const response = await api.patch('/api/notifications/read-all', null, { params });
  return response.data;
};

// Export API
export const exportCourseData = async (id) => {
  const response = await api.get(`/course/${id}/export`, {
    responseType: 'blob' // Important for file downloads
  });
  return response.data;
};

// Analytics APIs (Real ML Data)
export const getAdminAnalytics = async () => {
  const response = await api.get('/api/analytics/admin');
  return response.data;
};

export const getTeacherAnalytics = async () => {
  const response = await api.get('/api/analytics/teacher');
  return response.data;
};

export const getStudentProfile = async (id) => {
  const response = await api.get(`/api/analytics/student/${id}`);
  return response.data;
};
