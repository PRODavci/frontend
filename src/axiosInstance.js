import axios from 'axios';

const defaultBaseURL = '/api/v1';
console.log(process.env)

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
    baseURL: defaultBaseURL,
});

async function refreshAccessToken() {
    const response = await axios.post(
        `${defaultBaseURL}/auth/refresh`,
        null,
        {withCredentials: true}
    );
    return response.data.access_token;
}

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401 && !error.config._isRetry) {
            error.config._isRetry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(error.config);
            } catch (refreshError) {
                console.error('Failed to refresh access token:', refreshError);
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
