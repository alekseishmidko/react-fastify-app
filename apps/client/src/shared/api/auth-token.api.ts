export const AUTH_TOKEN_STORAGE_KEY = 'events_auth_token';

// Читает JWT/access token из localStorage.
// Его использует request interceptor в http.ts перед каждым API-запросом.
export function getAuthToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
}

// Сохраняет token после login/register.
// Если передать null, token удаляется, что используется для logout.
export function setAuthToken(token: string | null) {
    if (token) {
        localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
    } else {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    }
}
