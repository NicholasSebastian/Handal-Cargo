import { FC } from "react";
import { IInjectedProps } from "../../../components/abstractions/withInitialData";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import { gap } from "../../../components/basics/BasicView";
import View from "../../../components/specialized/ShippingTemplate/View";
import { columns } from "./MarkingTable";
import TravelDocumentForm from "./TravelDocument/Form";
import InvoiceForm from "./Invoice/Form";
import { dateToString, formatCurrency } from "../../../utils";

const SeaFreightView: FC<IInjectedProps> = props => (
  <View
    {...props}
    TravelDocumentForm={TravelDocumentForm}
    InvoiceForm={InvoiceForm}
    columns={columns}
    items={[
      { key: 'container_number', label: 'Nomor Container' },
      { key: 'muat_date', label: 'Tanggal Muat', render: dateToString },
      { key: 'container_group', label: 'Kelompok Container' },
      { key: 'arrival_date', label: 'Tanggal Tiba', render: dateToString },
      { key: 'carrier', label: 'Shipper' },
      { key: 'bl_date', label: 'Tanggal BL', render: dateToString },
      { key: 'route', label: 'Rute' },
      { key: 'currency', label: 'Mata Uang' },
      { key: 'handler', label: 'Pengurus' },
      { key: 'exchange_rate', label: 'Kurs', render: (value, record) => `${DEFAULT_SYMBOL}${formatCurrency(value)} / ${record.currency}` },
      { key: 'muat_fee', label: 'Biaya Muat', render: formatForeignCurrency },
      { key: 'additional_fee', label: 'Biaya Tambahan', render: formatForeignCurrency },
      { key: 'clearance_fee', label: 'Biaya Custom Clearance', render: formatForeignCurrency },
      { key: 'other_fee', label: 'Biaya Lain-Lain', render: value => DEFAULT_SYMBOL + formatCurrency(value) },
      gap,
      { label: 'Total Biaya', render: (_, record) => calculateTotal(record) },
      gap,
      { key: 'description', label: 'Keterangan' }
    ]} />
);

function formatForeignCurrency(value: any, record: Record<string, any>) {
  const { exchange_rate } = record;
  return DEFAULT_SYMBOL + formatCurrency(value * exchange_rate);
}

function calculateTotal(record: Record<string, any>) {
  const { muat_fee, additional_fee, clearance_fee, other_fee, exchange_rate } = record;
  const value = ((muat_fee + additional_fee + clearance_fee) * exchange_rate) + other_fee;
  return DEFAULT_SYMBOL + formatCurrency(value.toString());
}

export default SeaFreightView;
