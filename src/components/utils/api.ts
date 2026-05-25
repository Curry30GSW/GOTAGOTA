const API_BASE_URL = 'https://api-integracion-movil.vercel.app/api';

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

export const apiFetch = (endpoint: string, options: FetchOptions = {}): Promise<Response> => {
    const token = localStorage.getItem('token');
    const isFormData = options.body instanceof FormData;

    const defaultHeaders: HeadersInit = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        }
    });
};