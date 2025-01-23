import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api-dofa.fff.fr/api', // Base URL de l'API
    timeout: 5000, // Timeout des requêtes en millisecondes
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status || 'Unknown';
        const data = error.response?.data || 'No additional information';
        console.error(`API Error: Status ${status}, Details: ${JSON.stringify(data)}`);
        return Promise.reject(error);
    }
);

export default apiClient;