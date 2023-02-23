import moment from "moment";
import InputMeasurement from "../../../components/specialized/InputMeasurement";
import getSwitchableCustomerValue from "../../../components/specialized/SwitchableCustValue";
import { gap as formGap } from "../../../components/basics/BasicForm";
import { ITravelDocumentsStuff } from "../../../components/compounds/ShippingTemplate";
import { dateToString } from "../../../utils";

const travelDocumentsStuff: ITravelDocumentsStuff = {
  travelDocumentPrintPreset: 'sf-surat-jalan',
  travelDocumentDaerahPrintPreset: 'sf-surat-jalan-daerah',
  travelDocumentFilter: { container_number: { $exists: true } },
  travelDocumentColumns: [
    { dataIndex: 'marking', title: 'Marking' },
    { dataIndex: 'container_number', title: 'Nomor Container' },
    { dataIndex: 'carrier', title: 'Shipper' },
    { dataIndex: 'quantity', title: 'Kuantitas Kirim' }
  ],
  travelDocumentViewItems: [
    { key: 'marking', label: 'Marking' },
    { key: 'date', label: 'Tanggal', render: dateToString },
    { key: 'container_number', label: 'Nomor Container' },
    { key: 'route', label: 'Rute' },
    { key: 'quantity', label: 'Kuantitas Kirim' },
    { key: 'carrier', label: 'Shipper' },
    { key: 'measurement_option', label: 'Pilihan Ukuran' },
    { key: 'expedition', label: 'Expedisi' },
    { key: 'measurement', label: 'Ukuran' },
    { key: 'home_number', label: 'Nomor Telepon' },
    { key: 'unit', label: 'Satuan' },
    { key: 'phone_number', label: 'Nomor HP' },
    { key: 'customer', label: 'Customer' }, 
    { key: 'city', label: 'Kota' },
    { key: 'address', label: 'Alamat' },
    { key: 'description', label: 'Keterangan Kirim' }
  ],
  travelDocumentFormItems: [
    { key: 'marking', label: 'Marking', disabled: true },
    { key: 'date', label: 'Tanggal', type: 'date', defaultValue: moment(), required: true },
    { key: 'container_number', label: 'Nomor Container', disabled: true },
    { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
    { key: 'quantity', label: 'Kuantitas Kirim', type: 'number', required: true },
    { key: 'carrier', label: 'Shipper', type: 'select', items: 'Carriers' },
    { key: 'measurement_option', label: 'Pilihan Ukuran', type: 'select', required: true, 
      items: ['List (m³)', 'List (kg)', 'DList (m³)', 'DList (kg)', 'HB (m³)', 'HB (kg)', 'Cust (m³)', 'Cust (kg)'] 
    },
    { key: 'expedition', label: 'Expedisi', type: 'select', items: 'Expeditions' },
    { key: 'measurement', type: 'custom', render: InputMeasurement },
    formGap,
    { key: 'unit', label: 'Satuan', type: 'select', 
      items: ['Colly', 'Ball', 'Roll', 'Kardus', 'Pcs', 'Kodi', 'Lusin'] 
    },
    { key: 'home_number', type: 'custom', render: getSwitchableCustomerValue('Nomor Telepon', 'home_number_2') },
    { key: 'customer', label: 'Customer' }, 
    { key: 'phone_number', type: 'custom', render: getSwitchableCustomerValue('Nomor HP', 'phone_number_2') },
    { key: 'city', type: 'custom', render: getSwitchableCustomerValue('Kota', 'city_2') },
    { key: 'email', label: 'Email' },
    { key: 'address', type: 'custom', render: getSwitchableCustomerValue('Alamat', 'address_2', true) },
    { key: 'description', label: 'Keterangan Kirim', type: 'textarea' }
  ]  
};

export default travelDocumentsStuff;
