import { lazy } from "react";

// Lazy imports causes code-splitting of the different pages into multiple separate bundles.
// Allowing for quicker initial load times and decreased memory usage as data is only loaded as needed.

const AirCargo = lazy(() => import('./pages/shipping/AirCargo'));
const SeaFreight = lazy(() => import('./pages/shipping/SeaFreight'));
const InvoiceEntry = lazy(() => import('./pages/shipping/InvoiceEntry'));
const Payment = lazy(() => import('./pages/shipping/Payment'));
const Customers = lazy(() => import('./pages/shipping/Customers'));
const GenerateReports = lazy(() => import('./pages/GenerateReports'));
const ContainerGroups = lazy(() => import('./pages/references/ContainerGroups'));
const Carriers = lazy(() => import('./pages/references/Carriers'));
const Routes = lazy(() => import('./pages/references/Rutes'));
const Handlers = lazy(() => import('./pages/references/Handlers'));
const Planes = lazy(() => import('./pages/references/Planes'));
const Currencies = lazy(() => import('./pages/references/Currencies'));
const ProductDetails = lazy(() => import('./pages/references/ProductDetails'));
const Expeditions = lazy(() => import('./pages/references/Expeditions'));
const Payroll = lazy(() => import('./pages/Payroll'));
const Staff = lazy(() => import('./pages/admin/Staff'));
const StaffGroup = lazy(() => import('./pages/admin/StaffGroups'));
const AccessLevels = lazy(() => import('./pages/admin/AccessLevels'));
const CompanySetup = lazy(() => import('./pages/admin/CompanySetup'));
const BackupRestore = lazy(() => import('./pages/admin/BackupRestore'));

// Navigation structure.
const pages: Paths = {
  'Shipping': {
    'Sea Freight': <SeaFreight />,
    'Air Cargo': <AirCargo />,
    'Entri Faktur': <InvoiceEntry />,
    'Pembayaran': <Payment />,
    'Customers': <Customers />
  },
  'Reports': <GenerateReports />,
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
  'Payroll': <Payroll />,
  'Admin': {
    'Staff': <Staff />,
    'Kelompok Staff': <StaffGroup />,
    'Level Akses': <AccessLevels />,
    'Company Setup': <CompanySetup />,
    'Backup and Restore': <BackupRestore />
  }
};

export default pages;

type Paths = { 
  [key: string]: JSX.Element | { 
    [key: string]: JSX.Element 
  }
}
