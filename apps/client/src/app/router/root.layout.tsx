import { Outlet } from "react-router-dom"

// Самый верхний layout для всего дерева маршрутов.
// Он задает минимальный контейнер приложения, а всю конкретную страницу
// React Router подставляет через Outlet из дочерних routes.
export const RootLayout = () => {
    return (
        // min-h-svh использует small viewport height и лучше ведет себя
        // на мобильных браузерах с динамической адресной строкой, чем обычный 100vh.
        <div className="min-h-svh w-full">
            <Outlet />
        </div>
    )
}
