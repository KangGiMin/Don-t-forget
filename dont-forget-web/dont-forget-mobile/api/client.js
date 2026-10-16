import axios from 'axios';
import { auth } from '../firebase/firebase';

const api = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api',
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const token = await user.getIdToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
