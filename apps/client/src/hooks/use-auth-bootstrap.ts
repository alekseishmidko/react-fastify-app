
import { useAuthStore } from "@/stores/auth.store";
import { use } from "react";
import {ensureAuthBootstraped} from "@/app/auth-bootstrap.ts";

// Hook для первичной проверки авторизации при старте React-дерева.
// ensureAuthBootstraped() запускает bootstrap auth store один раз и возвращает promise.
export function useAuthBootstrap() {
    // React use(promise) приостанавливает render до завершения bootstrap.
    // После этого в auth store уже понятно: user загружен или пользователь не авторизован.
    use(ensureAuthBootstraped())

    // Возвращаем актуального user из Zustand store, чтобы компоненты могли строить auth UI.
    return useAuthStore(state => state.user)
}
