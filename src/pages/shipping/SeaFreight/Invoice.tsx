import { FC, useEffect } from "react";
import { Form, Input } from "antd";
import moment from "moment";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import { gap as viewGap } from "../../../components/basics/BasicView";
import { ICustomComponentProps } from "../../../components/basics/BasicForm";
import InputMeasurement from "../../../components/specialized/InputMeasurement";
import { IInvoicesStuff } from "../../../components/compounds/ShippingTemplate";
import { toDisplayRp } from "./ViewAndForm";
import { dateToString, formatCurrency } from "../../../utils";

const { useFormInstance, useWatch, Item } = Form;
const formatDefaultCurrency = (value: number) => DEFAULT_SYMBOL + formatCurrency(value);

const DisplayTotal: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const form = useFormInstance();

  const price = useWatch('price', form);
  const additionalFee = useWatch('additional_fee', form);
  const shipmentFee = useWatch('shipment_fee', form);
  const exchangeRate = useWatch('exchange_rate', form);

  useEffect(() => {
    form.setFieldsValue({ 
      ...form.getFieldsValue(true), 
      total: ((price + additionalFee + shipmentFee) * exchangeRate)
    });
  }, [price, additionalFee, shipmentFee, exchangeRate]);

  return (
    <Item 
      label={`Total Biaya (${DEFAULT_SYMBOL})`} 
      labelCol={{ span: 11 }}>
      <Input disabled value={DEFAULT_SYMBOL + formatCurrency(value ?? 0)} />
    </Item>
  );
};

const invoicesStuff: IInvoicesStuff = {
  invoicePrintPreset: 'sf-faktur',
  invoiceFilter: { container_number: { $exists: true } },
  invoiceColumns: formatCurrency => [
    { dataIndex: '_id', title: 'Nomor Faktur', render: value => value?.toString() },
    { dataIndex: 'marking', title: 'Marking' },
    { dataIndex: 'container_number', title: 'Nomor Container' },
    { dataIndex: 'quantity', title: 'Kuantitas' },
    { dataIndex: 'price', title: 'Harga', render: (price, { currency }) => formatCurrency(price, currency) }
  ],
  invoiceViewItems: formatCurrency => [
    { key: 'user', label: 'User' },
    { key: 'print_date', label: 'Tanggal Cetak', render: dateToString },
    { key: 'marking', label: 'Marking' },
    { key: 'date', label: 'Tanggal', render: dateToString },
    { key: 'container_number', label: 'Nomor Container' },
    { key: 'route', label: 'Rute' },
    { key: 'quantity', label: 'Kuantitas' },
    { key: 'carrier', label: 'Shipper' },
    { key: 'two_various', label: '2 Various', render: value => value ? 'Iya' : 'Tidak' },
    { key: 'measurement_details', label: 'Keterangan Ukuran' },
    { key: 'via_transfer', label: 'Via Transfer', render: value => value ? 'Iya' : 'Tidak' },
    { key: 'product_detail', label: 'Keterangan Barang' },
    { key: 'measurement_option', label: 'Pilihan Ukuran' },
    { key: 'currency', label: 'Mata Uang' },
    { key: 'measurement', label: 'Ukuran' },
    { key: 'exchange_rate', label: 'Kurs' },
    { key: 'expedition', label: 'Expedisi' },
    { key: 'price', label: 'Harga', render: (value, { currency }) => formatCurrency(value, currency) },
    { key: 'travel_number', label: 'No. Surat Jalan Expedisi' },
    { key: 'additional_fee', label: 'Biaya Tambahan', render: (value, { currency }) => formatCurrency(value, currency) },
    { key: 'nb', label: 'NB' },
    { key: 'shipment_fee', label: 'Ongkos Kirim', render: (value, { currency }) => formatCurrency(value, currency) },
    viewGap,
    { key: 'total', label: 'Total', render: formatDefaultCurrency }
  ],
  invoiceFormItems: [
    { key: 'user', label: 'User', disabled: true },
    { key: 'print_date', label: 'Tanggal Cetak', type: 'date', defaultValue: moment(), disabled: true },
    { key: 'marking', label: 'Marking', disabled: true },
    { key: 'date', label: 'Tanggal', type: 'date', defaultValue: moment() },
    { key: 'container_number', label: 'Nomor Container', required: true },
    { key: 'measurement_details', label: 'Keterangan Ukuran', disabled: true },
    { key: 'quantity', label: 'Kuantitas', type: 'number', required: true },
    { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
    { key: 'two_various', label: '2 Various', type: 'boolean' },
    { key: 'carrier', label: 'Shipper', type: 'select', items: 'Carriers' },
    { key: 'via_transfer', label: 'Via Transfer', type: 'boolean' },
    { key: 'product_detail', label: 'Keterangan Barang', type: 'select', items: 'ProductDetails' },
    { key: 'measurement_option', label: 'Pilihan Ukuran', type: 'select', required: true, 
      items: ['List (m³)', 'List (kg)', 'DList (m³)', 'DList (kg)', 'HB (m³)', 'HB (kg)', 'Cust (m³)', 'Cust (kg)'] 
    },
    { key: 'currency', label: 'Mata Uang', type: 'select', items: 'Currencies' },
    { key: 'measurement', type: 'custom', render: InputMeasurement },
    { key: 'exchange_rate', label: 'Kurs', type: 'number', defaultValue: 1 },
    { key: 'expedition', label: 'Expedisi', type: 'select',  items: 'Expeditions' },
    { key: 'price', label: 'Harga', type: 'currency', required: true, defaultValue: 0 },
    { key: 'travel_number', label: 'No. Surat Jalan Expedisi' },
    { key: 'additional_fee', label: 'Biaya Tambahan', type: 'currency', defaultValue: 0 },
    { key: 'customer', label: 'Customer', disabled: true },
    { type: 'custom', render: toDisplayRp({ key: 'additional_fee', label: 'Biaya Tambahan' }) },
    { key: 'city', label: 'Kota', disabled: true },
    { key: 'shipment_fee', label: 'Ongkos Kirim', type: 'currency', defaultValue: 0 },
    { key: 'nb', label: 'NB', type: 'textarea' },
    { key: 'total', type: 'custom', render: DisplayTotal }
  ]
};

export default invoicesStuff;
