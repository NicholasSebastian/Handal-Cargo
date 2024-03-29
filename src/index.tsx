import { register, isRegistered } from "@tauri-apps/api/globalShortcut";
import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { Spin } from 'antd';
import { DatabaseProvider } from './data/useDatabase';
import { ProfileProvider } from './data/useProfile';
import { PrintProvider } from "./components/abstractions/usePrint";
import { routes } from './data/useRoute';
import Layout from './components/specialized/Layout';
import Login from './pages/Login';
import { insertStringAtPos, IShortcut } from "./pages/Shortcuts";
import './normalize.css';

// This file marks the base of the entire app.

const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Shortcuts = lazy(() => import('./pages/Shortcuts'));

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

// Pages are separated into different routes, which are all wrapped
// in the Layout component and covered by the data context providers.

// The Login and authentication logic is handled by the DatabaseProvider component.

const elements = (
  <DatabaseProvider Login={Login}>
    <ProfileProvider>
      <HashRouter>
        <PrintProvider>
          <Layout>
            <Suspense fallback={<Center><Spin /></Center>}>
              <Routes>
                <Route path='/' element={<Navigate to={'/home'} />} />
                <Route path='/home' element={<Home />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/shortcuts' element={<Shortcuts />} />
                {routes}
              </Routes>
            </Suspense>
          </Layout>
        </PrintProvider>
      </HashRouter>
    </ProfileProvider>
  </DatabaseProvider>
);

const target = document.getElementById('root');
const root = ReactDOM.createRoot(target!);
root.render(elements);

// Registers all the shortcuts.
const shortcuts = localStorage.getItem('shortcuts');
if (shortcuts) {
  JSON.parse(shortcuts).forEach((shortcut: IShortcut) => {
    if (!isRegistered(shortcut.key)) {
      register(shortcut.key, () => insertStringAtPos(shortcut.value));
    }
  });
}
