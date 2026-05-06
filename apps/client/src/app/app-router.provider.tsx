import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { appRouter } from './router.tsx'

export const AppRouterProvider = () => {
    return (
        <Suspense
            fallback={
            <div className='grid min-h-svh place-itemes-center text-sm text-muted-foreground'>
        Загрузка...
    </div>
}
>
    <RouterProvider router={appRouter}/>
    </Suspense>
)
}
