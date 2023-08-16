import React from 'react';
import ReactDOM from 'react-dom/client';

// Import CSS Files
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import './index.css';

import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './app/context/AuthProvider';
import PartModalProvider from './app/context/PartModalProvider';

import dayjs from 'dayjs';

require('dayjs/locale/de')
dayjs.locale('de');

// Disable React DevTools if App is in production mode
if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // Remove Strict-Mode to prevent duplicate method execution (useReducer)
  <React.StrictMode>
    <AuthProvider>
      <PartModalProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PartModalProvider>
    </AuthProvider>
  </React.StrictMode>
);

