import { StrictMode, isValidElement } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DatabaseProvider } from './data/useDatabase';
import Layout from './components/Layout';
import Login from './pages/Login';
import pages from './navigation';
import './normalize.css';
import { toSlug } from './utils';

const DEFAULT_PAGE = '/sea-freight';

const routes = Object.entries(pages).map(([name, component]) => {
  return isValidElement(component) ? (
    <Route key={name} path={toSlug(name)} 
      element={component} />
  ) : (
    Object.entries(component).map(([nested_name, nested_component]) => (
      <Route key={nested_name} path={toSlug(nested_name)} 
        element={nested_component} />
    ))
  );
});

const elements = (
  <StrictMode>
    <DatabaseProvider Login={Login}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Navigate to={DEFAULT_PAGE} />} />
            {routes}
          </Routes>
        </Layout>
      </HashRouter>
    </DatabaseProvider>
  </StrictMode>
);

const target = document.getElementById('root');
const root = ReactDOM.createRoot(target!);
root.render(elements);
