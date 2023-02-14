import { FC, useState, useEffect } from "react";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import TableTemplate from "../../../../components/compounds/ViewTableTemplate";
import { IPageProps } from "../index";
import useDatabase from "../../../../data/useDatabase";
import print from "../../../../print";
import { dateToString, formatCurrency } from "../../../../utils";

const Invoice: FC<IPageProps> = props => {
  const { goBack } = props;
  const database = useDatabase();
  const [currencySymbols, setCurrencySymbols] = useState<Record<string, string>>();

  useEffect(() => {
    database?.collection('Currencies')
      .find({}, { projection: { _id: 0 }})
      .then(currencies => {
        const reference = Object.fromEntries(currencies.map(currency => [currency.name, currency.symbol]));
        setCurrencySymbols(reference);
      });
  }, []);

  const _formatCurrency = (price: string | number, currency: string) => {
    const value = formatCurrency(price);
    if (currencySymbols) 
      return currencySymbols[currency] + value;
    else 
      return value;
  }

  return (
    <TableTemplate
      title="Faktur Sea Freight"
      collectionName="Invoices"
      columns={[
        { dataIndex: '_id', title: 'Nomor Faktur', render: value => value?.toString() },
        { dataIndex: 'marking', title: 'Marking' },
        { dataIndex: 'container_number', title: 'Nomor Container' },
        { dataIndex: 'quantity', title: 'Kuantitas' },
        { dataIndex: 'price', title: 'Harga', render: (price, { currency }) => _formatCurrency(price, currency) }
      ]}
      viewItems={[
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
        { key: 'price', label: 'Harga', render: (value, { currency }) => _formatCurrency(value, currency) },
        { key: 'additional_fee', label: 'Biaya Tambahan', render: (value, { currency }) => _formatCurrency(value, currency) },
        { key: 'expedition', label: 'Expedisi' },
        { key: 'travel_number', label: 'No. Surat Jalan Expedisi' },
        { key: 'shipment_fee', label: 'Ongkos Kirim', render: (value, { currency }) => _formatCurrency(value, currency) },
        { key: 'total', label: 'Total', render: (value, { currency }) => _formatCurrency(value, currency) },
        { key: 'nb', label: 'NB' }
      ]}
      viewExtra={values => (
        <Button 
          onClick={() => print(values, 'sf-faktur')} 
          style={{ marginTop: '-40px', marginBottom: '10px' }}>
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
