import App from './pages/App';

type Paths = { 
  [key: string]: JSX.Element | { 
    [key: string]: JSX.Element 
  }
}

const pages: Paths = {
  'Shipping': {
    'Sea Freight': <App />,
    'Air Cargo': <App />,
    'Entry Faktur': <App />,
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
    'Staff': <App />,
    'Staff Groups': <App />,
    'Access Levels': <App />,
    'Company Setup': <App />,
    'Backup and Restore': <App />
  }
};

export default pages;
