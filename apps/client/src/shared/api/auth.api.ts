import { http } from "./http";
import type { AuthLoginRequest, AuthRegisterRequest, AuthResponse, UserProfile } from "./types";

// Методы для endpoints /auth/*.
// Каждый метод возвращает уже распакованный response.data.
export const authApi = {
    // POST /auth/login: проверяет email/password и возвращает token + публичные данные user.
    async login(payload: AuthLoginRequest): Promise<AuthResponse> {
        const { data } = await http.post<AuthResponse>('/auth/login', payload);

        return data;
    },
    // POST /auth/register: создает пользователя и возвращает token + публичные данные user.
    async register(payload: AuthRegisterRequest): Promise<AuthResponse> {
        const { data } = await http.post<AuthResponse>('/auth/register', payload)

        return data
    },
    // GET /auth/me: получает профиль текущего пользователя по Bearer token.
    async me(): Promise<UserProfile> {
        const { data } = await http.get<UserProfile>('/auth/me')

        return data
    }
} 
