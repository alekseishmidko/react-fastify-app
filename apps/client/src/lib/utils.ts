import { isAxiosError } from "@/shared/api/http"
import type { ApiErrorResponse } from "@/shared/api/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

export const DATETIME_LOCAL_INPUT_FORMAT = "yyyy-MM-dd'T'HH:mm"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getApiErrorMessage(
    error: unknown,
    fallback = 'Что-то пошло не так'
): string {
    if (isAxiosError<ApiErrorResponse>(error)) {
        const data = error.response?.data;

        if (data && typeof data.message === 'string') {
            return data.message
        }
    }

    if (error instanceof Error) {
        return error.message
    }

    return fallback
}

export function getUserInitials(name: string) {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 0) return '?'
    if (parts.length === 1) return parts[0].slice(0,2).toUpperCase()

    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

export function formatStartsAt(iso: string) {
    const d = parseISO(iso);

    if (!isValid(d)) return iso

    return format(d, 'PPp', { locale: ru})
}