import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import styled from 'styled-components';
import { DatabaseProvider } from './data/useDatabase';
import { ProfileProvider } from './data/useProfile';
import { routes } from './data/useRoute';
import Layout from './components/compounds/Layout';
import Login from './pages/Login';
import './normalize.css';

const DEFAULT_PAGE = '/sea-freight';
const Profile = lazy(() => import('./pages/Profile'));
const Shortcuts = lazy(() => import('./pages/Shortcuts'));
const News = lazy(() => import('./pages/News'));

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const elements = (
  <DatabaseProvider Login={Login}>
    <ProfileProvider>
      <HashRouter>
        <Layout>
          <Suspense fallback={<Center><Spin /></Center>}>
            <Routes>
              <Route path='/' element={<Navigate to={DEFAULT_PAGE} />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/shortcuts' element={<Shortcuts />} />
              <Route path='/news' element={<News />} />
              {routes}
            </Routes>
          </Suspense>
        </Layout>
      </HashRouter>
    </ProfileProvider>
  </DatabaseProvider>
);

const target = document.getElementById('root');
const root = ReactDOM.createRoot(target!);
root.render(elements);
