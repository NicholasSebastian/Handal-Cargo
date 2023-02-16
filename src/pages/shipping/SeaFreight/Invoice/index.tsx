import { FC } from "react";
import Page from "../../../../components/specialized/ShippingTemplate/Invoice";
import { IPageProps } from "../../../../components/specialized/ShippingTemplate/Table";
import { dateToString } from "../../../../utils";

const Invoice: FC<IPageProps> = props => (
  <Page
    {...props}
    title="Faktur Sea Freight"
    printPreset="sf-faktur"
    columns={formatCurrency => [
      { dataIndex: '_id', title: 'Nomor Faktur', render: value => value?.toString() },
      { dataIndex: 'marking', title: 'Marking' },
      { dataIndex: 'container_number', title: 'Nomor Container' },
      { dataIndex: 'quantity', title: 'Kuantitas' },
      { dataIndex: 'price', title: 'Harga', render: (price, { currency }) => formatCurrency(price, currency) }
    ]}
    viewItems={formatCurrency => [
      { key: 'user', label: 'User' },
      { key: 'print_date', label: 'Tanggal Cetak', render: value => dateToString(value) },
      { key: 'marking', label: 'Marking' },
      { key: 'date', label: 'Tanggal', render: value => dateToString(value) },
      { key: 'container_number', label: 'Nomor Container' },
      { key: 'measurement_details', label: 'Keterangan Ukuran' },
      { key: 'quantity', label: 'Kuantitas' },
      { key: 'route', label: 'Rute' },
      { key: 'two_various', label: '2 Various', render: value => value ? 'Iya' : 'Tidak' },
      { key: 'carrier', label: 'Shipper' },
      { key: 'via_transfer', label: 'Via Transfer', render: value => value ? 'Iya' : 'Tidak' },
      { key: 'product_detail', label: 'Keterangan Barang' },
      { key: 'measurement_option', label: 'Pilihan Ukuran' },
      { key: 'currency', label: 'Mata Uang' },
      { key: 'measurement', label: 'Ukuran' },
      { key: 'exchange_rate', label: 'Kurs' },
      { key: 'price', label: 'Harga', render: (value, { currency }) => formatCurrency(value, currency) },
      { key: 'additional_fee', label: 'Biaya Tambahan', render: (value, { currency }) => formatCurrency(value, currency) },
      { key: 'expedition', label: 'Expedisi' },
      { key: 'travel_number', label: 'No. Surat Jalan Expedisi' },
      { key: 'shipment_fee', label: 'Ongkos Kirim', render: (value, { currency }) => formatCurrency(value, currency) },
      { key: 'total', label: 'Total', render: (value, { currency }) => formatCurrency(value, currency) },
      { key: 'nb', label: 'NB' }
    ]} />
);

export default Invoice;
