import AirCargo from './pages/shipping/AirCargo';
import SeaFreight from './pages/shipping/SeaFreight';
import InvoiceEntry from './pages/shipping/InvoiceEntry';
import Payment from './pages/shipping/Payment';
import Customers from './pages/shipping/Customers';
import GenerateReports from './pages/reports/GenerateReports';
import ContainerGroups from './pages/references/ContainerGroups';
import Carriers from './pages/references/Carriers';
import Routes from './pages/references/Rutes';
import Handlers from './pages/references/Handlers';
import Planes from './pages/references/Planes';
import Currencies from './pages/references/Currencies';
import ProductDetails from './pages/references/ProductDetails';
import Expeditions from './pages/references/Expeditions';
import Staff from './pages/admin/Staff';
import StaffGroup from './pages/admin/StaffGroups';
import AccessLevels from './pages/admin/AccessLevels';
import CompanySetup from './pages/admin/CompanySetup';
import BackupRestore from './pages/admin/BackupRestore';

type Paths = { 
  [key: string]: JSX.Element | { 
    [key: string]: JSX.Element 
  }
}

const pages: Paths = {
  'Shipping': {
    'Sea Freight': <SeaFreight />,
    'Air Cargo': <AirCargo />,
    'Entri Faktur': <InvoiceEntry />,
    'Pembayaran': <Payment />,
    'Customers': <Customers />
  },
  'Reports': {
    'Laporan': <GenerateReports />
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
    'Company Setup': <CompanySetup />,
    'Backup and Restore': <BackupRestore />
  }
};

export default pages;
