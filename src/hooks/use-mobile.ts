import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Хук для определения мобильного устройства
 * 
 * Использует matchMedia API для эффективного отслеживания изменений размера экрана.
 * Начинает с false для предотвращения ошибок гидратации SSR.
 * 
 * @returns {boolean} true если ширина экрана меньше MOBILE_BREAKPOINT
 */
export function useIsMobile(): boolean {
  // Всегда начинаем с false для SSR, обновляем после монтирования
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    // Используем matches из MediaQueryList вместо проверки innerWidth
    const updateIsMobile = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };

    // Инициализируем значение после монтирования
    setIsMobile(mql.matches);

    // Современный API для matchMedia
    if (mql.addEventListener) {
      mql.addEventListener("change", updateIsMobile);
      return () => mql.removeEventListener("change", updateIsMobile);
    } else {
      // Fallback для старых браузеров
      mql.addListener(updateIsMobile);
      return () => mql.removeListener(updateIsMobile);
    }
  }, []);

  return isMobile;
}
