import { FC } from "react";
import Page from "../../../../components/specialized/ShippingTemplate/TravelDocument";
import { IPageProps } from "../../../../components/specialized/ShippingTemplate";
import { dateToString } from "../../../../utils";

const TravelDocument: FC<IPageProps> = props => (
  <Page
    {...props}
    title="Surat Jalan Sea Freight"
    printPreset="sf-surat-jalan"
    printDaerahPreset="sf-surat-jalan-daerah"
    columns={[
      { dataIndex: 'marking', title: 'Marking' },
      { dataIndex: 'container_number', title: 'Nomor Container' },
      { dataIndex: 'carrier', title: 'Shipper' },
      { dataIndex: 'quantity', title: 'Kuantitas Kirim' }
    ]}
    viewItems={[
      { key: 'marking', label: 'Marking' },
      { key: 'date', label: 'Tanggal', render: value => dateToString(value) },
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
    ]} />
);

export default TravelDocument;
