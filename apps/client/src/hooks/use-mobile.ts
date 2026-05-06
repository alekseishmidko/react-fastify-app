import {useEffect, useState} from "react";


// Граница между mobile и desktop layout.
const MOBILE_BREAKPOINT = 768

// Hook возвращает true, если ширина окна меньше MOBILE_BREAKPOINT.
// Используется для условного рендера/поведения компонентов под мобильный viewport.
export function useIsMobile() {
    // undefined до первого эффекта нужен, чтобы не читать window во время initial render.
    const [isMobile, setIsMobile] =  useState<boolean | undefined>(undefined)

  useEffect(() => {
        // matchMedia подписывает hook на изменение viewport относительно breakpoint.
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        }
        // Подписываемся на смену media query и сразу выставляем начальное значение.
        mql.addEventListener("change", onChange)
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        return () => mql.removeEventListener("change", onChange)
    }, [])

    // Пока эффект еще не выполнился, undefined превращается в false.
    return !!isMobile
}
