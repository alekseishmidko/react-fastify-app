import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// Flat config ESLint для клиентского приложения.
// defineConfig помогает ESLint корректно типизировать и читать массив конфигов.
export default defineConfig([
  // Не проверяем собранные файлы: dist генерируется Vite/TypeScript и не должен
  // влиять на качество исходников.
  globalIgnores(['dist']),
  {
    // Этот блок применяется ко всем TypeScript и React TypeScript файлам клиента.
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Базовые рекомендованные правила ESLint для JavaScript:
      // ловят очевидные ошибки вроде неиспользуемых переменных, недостижимого кода
      // и некорректных конструкций языка.
      js.configs.recommended,
      // Рекомендованный набор typescript-eslint добавляет правила,
      // которые понимают синтаксис TypeScript и типовые TS-паттерны.
      tseslint.configs.recommended,
      // Правила для React Hooks: проверяют корректность вызовов hooks
      // и полноту dependency arrays в useEffect/useMemo/useCallback.
      reactHooks.configs.flat.recommended,
      // Правила Vite Fast Refresh: помогают не ломать hot reload,
      // например предупреждают о смешивании компонентных и некомпонентных exports.
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      // Указываем современную версию JavaScript-синтаксиса, которую ESLint
      // должен понимать при разборе файлов.
      ecmaVersion: 2020,
      // Добавляем браузерные глобальные переменные: window, document, fetch и т.д.
      globals: globals.browser,
    },
  },
])
