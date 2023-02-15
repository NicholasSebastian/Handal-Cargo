import { FC } from "react";
import moment from "moment";
import Form from "../../../../components/specialized/ShippingTemplate/TravelDocumentForm";
import { IFormProps } from "../../../../components/specialized/ShippingTemplate/View";
import InputMeasurement from "../../../../components/specialized/InputMeasurement";

const TravelDocumentForm: FC<IFormProps> = props => (
  <Form
    {...props}
    printPreset='sf-surat-jalan'
    printDaerahPreset='sf-surat-jalan-daerah'
    items={[
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
      { key: 'home_number', label: 'Nomor Telepon' },
      { key: 'unit', label: 'Satuan', type: 'select', 
        items: ['Colly', 'Ball', 'Roll', 'Kardus', 'Pcs', 'Kodi', 'Lusin'] 
      },
      { key: 'phone_number', label: 'Nomor HP' },
      { key: 'customer', label: 'Customer' }, 
      { key: 'city', label: 'Kota' },
      { key: 'address', label: 'Alamat', type: 'textarea' },
      { key: 'description', label: 'Keterangan Kirim', type: 'textarea' }
    ]} />
);

export default TravelDocumentForm;
