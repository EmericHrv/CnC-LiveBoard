import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api-dofa.fff.fr/api', // Base URL de l'API
    timeout: 5000, // Timeout des requêtes en millisecondes
    headers: {
        'User-Agent': 'classement-esm/1.0.0',
        'Accept': 'application/json',
    },
});

// 🔍 Intercepteur pour logguer l'URL complète de chaque requête
apiClient.interceptors.request.use(
    (config) => {
        const fullUrl = `${config.baseURL?.replace(/\/$/, '')}/${config.url?.replace(/^\//, '')}`;
        // console.log(`➡️ API Request: [${config.method?.toUpperCase()}] ${fullUrl}`);
        return config;
    },
    (error) => {
        console.error('❌ Request config error:', error);
        return Promise.reject(error);
    }
);

// 📛 Intercepteur pour logguer les erreurs de réponse
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
