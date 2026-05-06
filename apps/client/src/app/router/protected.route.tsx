
import { Navigate } from "react-router-dom";
import { ProtectedLayout } from "./protected.layout.tsx";
import {useAuthBootstrap} from "@/hooks/use-auth-bootstrap.ts";

// Guard для приватной части приложения.
// Все дочерние routes под этим компонентом считаются доступными только
// после завершения bootstrap авторизации и наличия user в auth store.
export function ProtectedRoute() {
    // Хук синхронизирует роутинг с первичной проверкой сессии:
    // пока bootstrap не завершен, React Suspense удерживает render,
    // а после завершения здесь уже доступно актуальное состояние user.
    const user = useAuthBootstrap();

    if (!user) {
        // Неавторизованных пользователей отправляем на login.
        // replace не оставляет приватный URL в истории как предыдущую страницу,
        // чтобы после входа/возврата не происходил цикл по недоступному маршруту.
        return <Navigate to="login" replace/>
    }

    // Для авторизованного пользователя подключаем общий layout приватной зоны.
    // Сами страницы events/* будут отрисованы внутри Outlet в ProtectedLayout.
    return <ProtectedLayout />
}
