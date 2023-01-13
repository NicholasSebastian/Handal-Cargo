import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DatabaseProvider } from './data/useDatabase';
import { routes } from './data/useRoute';
import Layout from './components/compounds/Layout';
import Login from './pages/Login';
import './normalize.css';
import Profile from './pages/Profile';

const DEFAULT_PAGE = '/sea-freight';

const elements = (
  <DatabaseProvider Login={Login}>
    <HashRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Navigate to={DEFAULT_PAGE} />} />
          <Route path='/profil' element={<Profile />} />
          {routes}
        </Routes>
      </Layout>
    </HashRouter>
  </DatabaseProvider>
);

const target = document.getElementById('root');
const root = ReactDOM.createRoot(target!);
root.render(elements);
