import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './normalize.css';
import { DatabaseProvider } from './data/useDatabase';
import App from './pages/App';
import Login from './pages/Login';

const elements = (
  <StrictMode>
    <DatabaseProvider Login={Login}>
      <App />
    </DatabaseProvider>
  </StrictMode>
);

const target = document.getElementById('root');
const root = ReactDOM.createRoot(target!);
root.render(elements);
