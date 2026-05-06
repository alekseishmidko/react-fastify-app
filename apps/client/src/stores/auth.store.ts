import { getApiErrorMessage } from '@/lib/utils'

import type { AuthLoginRequest, AuthRegisterRequest, UserPublic } from '@/shared/api/types'
import { create } from 'zustand'
import {authApi, getAuthToken, setAuthToken} from "@/shared/api";

// Zustand store для auth-состояния приложения.
// Хранит текущего user, состояние загрузки и ошибки login/register/bootstrap.
type AuthState = {
    // null означает, что пользователь не авторизован или профиль еще не загружен.
    user: UserPublic | null

    // bootstraped показывает, что приложение уже проверило token из localStorage.
    // Это нужно, чтобы не дергать /auth/me повторно при каждом рендере.
    bootstraped: boolean
    isAuthLoading: boolean
    authError: string | null

    // bootstrap вызывается при старте приложения: проверяет сохраненный token и загружает /auth/me.
    bootstrap: () => Promise<void>
    // login/register сохраняют token и кладут user в store.
    login: (payload: AuthLoginRequest) => Promise<void>
    register: (payload: AuthRegisterRequest) => Promise<void>
    // logout чистит token и user.
    logout: () => void
    clearAuthError: () => void
    // featchMe вручную обновляет user по текущему token.
    featchMe: () => Promise<void>
}

// Backend /auth/me возвращает UserProfile с датами, а auth state хранит только публичную часть.
function profileToUser(profile: {
    id: string
    email: string
    name: string
}): UserPublic {
    return { id: profile.id, email: profile.email, name: profile.name }
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    bootstraped: false,
    isAuthLoading: false,
    authError: null,
    bootstrap: async () => {
        // Если bootstrap уже проходил, второй раз не запрашиваем /auth/me.
        if (get().bootstraped) {
            return
        }

        set({ isAuthLoading: true, authError: null})

        try {
            // Нет token - пользователь точно не авторизован, API-запрос не нужен.
            if (!getAuthToken()) {
                set({user: null, bootstraped: true, isAuthLoading: false})

                return
            }

            // Token есть - проверяем его на backend и получаем актуальный профиль.
            const profile = await authApi.me();

            set({
                user: profileToUser(profile),
                bootstraped: true,
                isAuthLoading: false
            })
        } catch (error) {
            // Если token протух или невалиден, чистим его и считаем пользователя разлогиненным.
            setAuthToken(null)
            set({
                user: null,
                bootstraped: true,
                isAuthLoading: false
            })
        }
    },
    login: async (payload) => {
        set({isAuthLoading: true, authError: null})

        try {
            // После успешного login token сохраняется в localStorage,
            // а http interceptor начнет подставлять его в следующие запросы.
            const { token, user } = await authApi.login(payload);

            setAuthToken(token)
            set({ user, isAuthLoading: false})
        } catch (error) {
            set({
                isAuthLoading: false,
                authError: getApiErrorMessage(error, 'Не удалось войти')
            })

            throw error
        }
    },
    register: async (payload) => {
        set({isAuthLoading: true, authError: null})

        try {
            // Регистрация сразу авторизует пользователя: backend возвращает token + user.
            const { token, user } = await authApi.register(payload)
            setAuthToken(token);
            set({user, isAuthLoading: false})
        } catch (error) {
            set({
                isAuthLoading: false,
                authError: getApiErrorMessage(error, 'Не удалось зарегистрироваться')
            })

            throw error
        }
    },
    logout: () => {
        // Достаточно удалить token и user: защищенные запросы больше не получат Authorization header.
        setAuthToken(null)
        set({ user: null, authError: null})
    },
    clearAuthError: () => {
        set({ authError: null})
    },
    featchMe: async () => {
        // Без token профиль получить нельзя, поэтому просто сбрасываем user.
        if (!getAuthToken()) {
            set({ user: null })

            return
        }

        try {
            // Обновляет user из backend, например после перезагрузки или ручной синхронизации.
            const profile = await authApi.me()

            set({ user: profileToUser(profile) })
        } catch (error) {
            // Ошибка /auth/me обычно означает невалидный token.
            setAuthToken(null);
            set({ user: null })
        }
    }
}))
