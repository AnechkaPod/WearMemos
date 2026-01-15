export const API_BASE_URL = "https://localhost:7077";

export const getAuthToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getAuthToken();

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
