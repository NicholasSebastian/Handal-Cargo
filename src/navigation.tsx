import App from './pages/App';
import AccessLevels from './pages/AccessLevels';
import Staff from './pages/Staff';
import StaffGroup from './pages/StaffGroups';

type Paths = { 
  [key: string]: JSX.Element | { 
    [key: string]: JSX.Element 
  }
}

const pages: Paths = {
  'Shipping': {
    'Sea Freight': <App />,
    'Air Cargo': <App />,
    'Entri Faktur': <App />,
    'Pembayaran': <App />,
    'Customers': <App />
  },
  'References': {
    'Container Groups': <App />,
    'Carriers': <App />,
    'Routes': <App />,
    'Handlers': <App />,
    'Planes': <App />,
    'Currencies': <App />,
    'Product Details': <App />,
    'Expeditions': <App />
  },
  'Admin': {
    'Staff': <Staff />,
    'Staff Groups': <StaffGroup />,
    'Access Levels': <AccessLevels />,
    'Company Setup': <App />,
    'Backup and Restore': <App />
  }
};

export default pages;
