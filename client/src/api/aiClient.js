import axios from 'axios';
const aiApi = axios.create({
    baseURL: import.meta.env.VITE_AI_URL || 'http://localhost:8000',
});

export default aiApi;