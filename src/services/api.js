import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request - Token:', token ? 'Present' : 'Missing');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.log('API Response Error:', error.config?.url, error.response?.status, error.message);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access - but don't redirect for file uploads or profile pages
      const isFileUpload = error.config?.url?.includes('/auth/upload');
      const isProfilePage = window.location.pathname === '/profile';
      
      console.log('401 Error - isFileUpload:', isFileUpload, 'isProfilePage:', isProfilePage);
      
      if (!isFileUpload && !isProfilePage) {
        console.log('Redirecting to home page due to 401');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      } else {
        console.log('Not redirecting due to file upload or profile page');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register new user (with file uploads)
  register: (userData) => api.post('/auth/register', userData),
  
  // Basic registration (without file uploads)
  registerBasic: (userData) => api.post('/auth/register-basic', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get profile suggestions
  getProfileSuggestions: () => api.get('/auth/profile-suggestions'),
  
  // Get profile
  getProfile: () => api.get('/profile'),
  
  // Update profile
  updateProfile: (profileData) => {
    console.log('API updateProfile called with:', profileData);
    return api.put('/profile', profileData);
  },
  
  // Upload files
  uploadFiles: (formData) => {
    const token = localStorage.getItem('token');
    console.log('API uploadFiles called with token:', token ? 'Present' : 'Missing');
    console.log('FormData entries:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }
    
    return api.post('/auth/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
  },
};

// User search and public profiles
export const usersAPI = {
  searchUsers: (query, limit = 10, type = 'all') => {
    const token = localStorage.getItem('token');
    return api.get(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}&type=${type}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  getPublicProfile: (userId) => {
    const token = localStorage.getItem('token');
    return api.get(`/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Company search and profiles
export const companiesAPI = {
  searchCompanies: (query, limit = 10) => {
    const token = localStorage.getItem('token');
    return api.get(`/companies/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  
  getCompanyProfile: (companyId) => {
    const token = localStorage.getItem('token');
    return api.get(`/companies/${companyId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Avatar upload
export const avatarAPI = {
  uploadAvatar: (formData) => {
    const token = localStorage.getItem('token');
    return api.post('/auth/upload-avatar', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Health check
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
