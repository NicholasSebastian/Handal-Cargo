import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DatabaseProvider } from './data/useDatabase';
import { ProfileProvider } from './data/useProfile';
import { routes } from './data/useRoute';
import Layout from './components/compounds/Layout';
import Login from './pages/Login';
import './normalize.css';
import Profile from './pages/Profile';
import Shortcuts from './pages/Shortcuts';
import News from './pages/News';

const DEFAULT_PAGE = '/sea-freight';

const elements = (
  <DatabaseProvider Login={Login}>
    <ProfileProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<Navigate to={DEFAULT_PAGE} />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/shortcuts' element={<Shortcuts />} />
            <Route path='/news' element={<News />} />
            {routes}
          </Routes>
        </Layout>
      </HashRouter>
    </ProfileProvider>
  </DatabaseProvider>
);

const target = document.getElementById('root');
const root = ReactDOM.createRoot(target!);
root.render(elements);
