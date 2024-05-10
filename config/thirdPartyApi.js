const axios=require('axios');

const axiosAPI = axios.create({
  baseURL:"https://online.c3xpress.com/C3XService.svc/",
  withCredentials: true,
});

// Add a request interceptor
axiosAPI.interceptors.request.use(
  (config) => {
    // Get the token from your desired source (localStorage, etc.)
    // const token = localStorage.getItem("token"); // Replace with your actual token
    // if (token) {
    //   config.headers["Authorization"] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

module.exports={axiosAPI};