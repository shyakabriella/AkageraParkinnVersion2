import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-hosted fonts — no Google CDN request (avoids ERR_BLOCKED_BY_CLIENT)
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import App from './App.jsx';
import './index.css';
createRoot(document.getElementById('root')).render(<StrictMode>
    <App />
  </StrictMode>);
