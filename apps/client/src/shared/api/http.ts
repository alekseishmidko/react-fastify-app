import axios, { AxiosError } from 'axios'
import { getAuthToken } from './auth-token.api'

// Базовый URL backend API берется из Vite env.
// Все запросы из shared/api идут относительно этого адреса.
const baseURL = import.meta.env.VITE_API_URL

if (!baseURL) {
    throw new Error("VITE_API_URL не задан в .env")
}

// Общий axios instance для всего клиентского API-слоя.
// Остальные api-файлы используют его вместо прямого axios.get/post.
export const http = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Перед каждым запросом достаем сохраненный auth token и,
// если он есть, автоматически добавляем Bearer Authorization header.
http.interceptors.request.use((config) => {
    const token = getAuthToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})

export type ApiValidationError = {
    message: string;
    errors: Array<{path: string; message: string}>
}

// Type guard для безопасной работы с ошибками axios в catch-блоках.
export function isAxiosError<T = unknown>(e: unknown): e is AxiosError<T> {
    return axios.isAxiosError(e)
}
