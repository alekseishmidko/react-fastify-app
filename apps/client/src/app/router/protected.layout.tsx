import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";

// Общая оболочка для всех защищенных страниц приложения.
// Здесь собирается постоянный интерфейс приватной зоны: sidebar, header,
// провайдер тултипов и область, куда React Router вставляет текущую страницу.
export function ProtectedLayout() {
    return (
        // TooltipProvider нужен на уровне layout, чтобы элементы сайдбара,
        // кнопки и вложенные страницы могли пользоваться tooltip UI без
        // повторного подключения провайдера в каждом экране.
        <TooltipProvider>
            {/* SidebarProvider хранит состояние бокового меню и отдает его AppSidebar/SidebarTrigger. */}
            <SidebarProvider>
                <AppSidebar/>
                {/* SidebarInset сдвигает основной контент с учетом открытого/закрытого sidebar. */}
                <SidebarInset>
                    {/* Верхняя панель приватной зоны: сейчас в ней находится триггер сайдбара. */}
                    <header className="flex h-12 items-center px-4">
                        <SidebarTrigger />
                    </header>
                    {/* Основная область страницы. Outlet заменяется конкретным events-маршрутом. */}
                    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col p-4 pt-0">
                        <Outlet />
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}
