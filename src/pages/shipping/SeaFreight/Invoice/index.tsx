import { FC } from "react";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import TableTemplate from "../../../../components/compounds/ViewTableTemplate";
import { IPageProps } from "../index";
import print from "../../../../print";
import { dateToString } from "../../../../utils";

const Invoice: FC<IPageProps> = props => {
  const { goBack } = props;

  return (
    <TableTemplate
      title="Faktur Sea Freight"
      collectionName="Invoices"
      columns={[
        { dataIndex: '_id', title: 'Nomor Faktur' },
        { dataIndex: 'marking', title: 'Marking' },
        { dataIndex: 'container_number', title: 'Nomor Container' },
        { dataIndex: 'quantity', title: 'Kuantitas' },
        { dataIndex: 'price', title: 'Harga' }
      ]}
      viewItems={[
        { key: 'user', label: 'User' },
        { key: 'print_date', label: 'tanggal_cetak', render: value => dateToString(value) },
        { key: 'marking', label: 'Marking' },
        { key: 'date', label: 'Tanggal' },
        { key: 'container_number', label: 'Nomor Container' },
        { key: 'measurement_details', label: 'Keterangan Ukuran' },
        { key: 'quantity', label: 'Kuantitas' },
        { key: 'route', label: 'Rute' },
        { key: 'two_various', label: '2 Various' },
        { key: 'carrier', label: 'Shipper' },
        { key: 'via_transfer', label: 'Via Transfer' },
        { key: 'product_detail', label: 'Keterangan Barang' },
        { key: 'measurement_option', label: 'Pilihan Ukuran' },
        { key: 'currency', label: 'Mata Uang' },
        { key: 'measurement', label: 'Ukuran' },
        { key: 'exchange_rate', label: 'Kurs' },
        { key: 'price', label: 'Harga' },
        { key: 'additional_fee', label: 'Biaya Tambahan' },
        { key: 'expedition', label: 'Expedisi' },
        { key: 'travel_number', label: 'No. Surat Jalan Expedisi' },
        { key: 'shipment_fee', label: 'Ongkos Kirim' },
        { key: 'nb', label: 'NB' },
        { key: 'total', label: 'Total' }
      ]}
      viewExtra={values => (
        <Button onClick={() => print(values, 'sf-faktur')}>
          Print Ulang Faktur
        </Button>
      )}
      extra={
        <Button 
          icon={<LeftOutlined />} 
          onClick={goBack}>
          Kembali
        </Button>
      } />
  );
}

export default Invoice;
