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
