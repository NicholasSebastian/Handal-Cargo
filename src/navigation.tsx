import ContainerGroups from './pages/references/ContainerGroups';
import Carriers from './pages/references/Carriers';
import Routes from './pages/references/Rutes';
import Handlers from './pages/references/Handlers';
import Planes from './pages/references/Planes';
import Currencies from './pages/references/Currencies';
import ProductDetails from './pages/references/ProductDetails';
import Expeditions from './pages/references/Expeditions';
import AccessLevels from './pages/admin/AccessLevels';
import Staff from './pages/admin/Staff';
import StaffGroup from './pages/admin/StaffGroups';

type Paths = { 
  [key: string]: JSX.Element | { 
    [key: string]: JSX.Element 
  }
}

const pages: Paths = {
  'Shipping': {
    'Sea Freight': <div>empty</div>,
    'Air Cargo': <div>empty</div>,
    'Entri Faktur': <div>empty</div>,
    'Pembayaran': <div>empty</div>,
    'Customers': <div>empty</div>
  },
  'References': {
    'Kelompok Container': <ContainerGroups />,
    'Shipper': <Carriers />,
    'Rute': <Routes />,
    'Pengurus': <Handlers />,
    'Pesawat': <Planes />,
    'Mata Uang': <Currencies />,
    'Keterangan Barang': <ProductDetails />,
    'Expedisi': <Expeditions />
  },
  'Admin': {
    'Staff': <Staff />,
    'Kelompok Staff': <StaffGroup />,
    'Level Akses': <AccessLevels />,
    'Company Setup': <div>empty</div>,
    'Backup and Restore': <div>empty</div>
  }
};

export default pages;
