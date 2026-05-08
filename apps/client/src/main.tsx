import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { AppRouterProvider } from './app/app-router.provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouterProvider />
  </StrictMode>,
);
