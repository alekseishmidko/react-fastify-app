import { Navigate, Outlet } from 'react-router-dom';
import { useAuthBootstrap } from '@/hooks/use-auth-bootstrap.ts';

// Guard для страниц, доступных только неавторизованным пользователям:
// login/register должны открываться гостю, но не должны показываться пользователю,
// который уже прошел bootstrap авторизации и есть в auth store.
export function GuestRoute() {
  // useAuthBootstrap сначала дожидается первичной проверки сессии.
  // Поэтому ниже мы принимаем решение о редиректе уже после того,
  // как приложение узнало, есть ли текущий пользователь.
  const user = useAuthBootstrap();
  console.log(user);
  if (user) {
    // Авторизованному пользователю нет смысла оставаться на auth-страницах.
    // replace убирает login/register из истории браузера, чтобы кнопка "назад"
    // не возвращала его обратно на страницу входа после успешной авторизации.
    return <Navigate to="/events" replace />;
  }

  // Если пользователя нет, рендерим вложенный гостевой маршрут
  // из конфигурации router: login или register.
  return <Outlet />;
}
