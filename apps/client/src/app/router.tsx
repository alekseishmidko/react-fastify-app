import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./router/root-layout";
import { RootRedirect } from "./router/root-redirect";
import { GuestRoute } from "./router/guest-route";
import { ProtectedRoute } from "./router/protected-route";
import { AuthRegisterPage } from "@/pages/auth/register/page";
import { AuthLoginPage } from "@/pages/auth/login/page";
import { EventsAllPage } from "@/pages/events/all/page";
import { EventsNewPage } from "@/pages/events/new/page";
import { EventDetailsPage } from "@/pages/events/details/page";
import { EventsEditPage } from "@/pages/events/edit/page";
import { EventsMyPage } from "@/pages/events/my/page";

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children : [
            { index: true, element: <RootRedirect /> },
            {
                element: <GuestRoute />,
                children: [
                    { path: 'login', element: <AuthLoginPage /> },
                    { path: 'register', element: <AuthRegisterPage /> }
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    { path: 'events', element: <EventsAllPage /> },
                    { path: 'events/my', element: <EventsMyPage /> },
                    { path: 'events/new', element: <EventsNewPage /> },
                    { path: 'events/:id', element: <EventDetailsPage /> },
                    { path: 'events/:id/edit', element: <EventsEditPage /> },
                ]
            },
            { path: "*", element: <Navigate to="/" replace />}
]
}
])