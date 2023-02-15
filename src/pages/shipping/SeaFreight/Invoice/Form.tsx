import { FC } from "react";
import moment from "moment";
import { DEFAULT_SYMBOL } from "../../../../components/abstractions/useCurrencyHandling";
import Form from "../../../../components/specialized/ShippingTemplate/InvoiceForm";
import { IFormProps } from "../../../../components/specialized/ShippingTemplate/View";
import InputMeasurement from "../../../../components/specialized/InputMeasurement";
import DisplayTotal from "../../../../components/specialized/DisplayTotal";
import createDependentValue from "../../../../components/basics/DependentValue";
import { formatCurrency } from "../../../../utils";

const InvoiceForm: FC<IFormProps> = props => (
  <Form
    {...props}
    printPreset="sf-faktur"
    items={[
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
      { key: 'price', label: 'Harga', type: 'currency', required: true, defaultValue: 0 },
      { key: 'additional_fee', label: 'Biaya Tambahan', type: 'currency', defaultValue: 0 },
      { key: 'expedition', label: 'Expedisi', type: 'select',  items: 'Expeditions' },
      { 
        type: 'custom', 
        render: createDependentValue({
          label: `Biaya Tambahan (${DEFAULT_SYMBOL})`,
          dependencies: ['additional_fee', 'exchange_rate'],
          calculateValue: ([additional_fee, exchange_rate]) => {
            const value = additional_fee * exchange_rate;
            return formatCurrency(value.toString());
          },
          defaultValue: 0,
          prefix: DEFAULT_SYMBOL
        })
      },
      { key: 'travel_number', label: 'No. Surat Jalan Expedisi' },
      { key: 'shipment_fee', label: 'Ongkos Kirim', type: 'currency', defaultValue: 0 },
      { key: 'nb', label: 'NB', type: 'textarea' },
      { key: 'total', type: 'custom', render: DisplayTotal }
    ]} />
);

export default InvoiceForm;
