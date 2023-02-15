import { FC } from "react";
import { IInjectedProps } from "../../../components/abstractions/withInitialData";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import { gap } from "../../../components/basics/BasicView";
import View from "../../../components/specialized/ShippingTemplate/View";
import { columns } from "./MarkingTable";
import TravelDocumentForm from "./TravelDocument/Form";
import InvoiceForm from "./Invoice/Form";
import { dateToString, formatCurrency } from "../../../utils";

const AirCargoView: FC<IInjectedProps> = props => (
  <View
    {...props}
    TravelDocumentForm={TravelDocumentForm}
    InvoiceForm={InvoiceForm}
    columns={columns}
    items={[
      { key: 'airwaybill_number', label: 'Nomor Air Waybill' },
      { key: 'muat_date', label: 'Tanggal Muat', render: dateToString },
      { key: 'item_code', label: 'Kode Barang' },
      { key: 'arrival_date', label: 'Tanggal Tiba', render: dateToString },
      { key: 'route', label: 'Rute' },
      { key: 'currency', label: 'Mata Uang' },
      { key: 'plane', label: 'Pesawat' },
      { key: 'exchange_rate', label: 'Kurs', render: (value, record) => `${DEFAULT_SYMBOL}${formatCurrency(value)} / ${record.currency}` },
      { key: 'freight_fee', label: 'Freight Charge / kg', render: formatForeignCurrency },
      { label: 'Total Freight', render: (_, record) => calculateTotalFreight(record) },
      { key: 'freight_weight', label: 'Berat Freight (kg)', render: value => value + ' kg' },
      { label: 'Total Komisi', render: (_, record) => calculateTotalCommission(record) },
      { key: 'commission_fee', label: 'Biaya Komisi', render: formatForeignCurrency },
      { label: 'Total Custom Clearance', render: (_, record) => calculateTotalClearance(record) },
      { key: 'commission_weight', label: 'Berat Komisi (kg)', render: value => value + ' kg' },
      { key: 'additional_fee', label: 'Biaya Tambahan', render: formatForeignCurrency },
      { key: 'clearance_fee', label: 'Biaya Custom Clearance', render: formatForeignCurrency },
      { key: 'other_fee', label: 'Biaya Lain-Lain', render: value => DEFAULT_SYMBOL + formatCurrency(value) },
      { key: 'clearance_weight', label: 'Berat Clearance (kg)', render: value => value + ' kg' },
      { label: 'Total Biaya', render: (_, record) => calculateTotal(record) },
      gap,
      { key: 'description', label: 'Keterangan' }
    ]} />
);

function formatForeignCurrency(value: any, record: Record<string, any>) {
  const { exchange_rate } = record;
  return DEFAULT_SYMBOL + formatCurrency(value * exchange_rate);
}

function calculateTotalFreight(record: Record<string, any>) {
  const { freight_fee, freight_weight, exchange_rate } = record;
  return DEFAULT_SYMBOL + formatCurrency(freight_fee * freight_weight * exchange_rate);
}

function calculateTotalCommission(record: Record<string, any>) {
  const { commission_fee, commission_weight, exchange_rate } = record;
  return DEFAULT_SYMBOL + formatCurrency(commission_fee * commission_weight * exchange_rate);
}

function calculateTotalClearance(record: Record<string, any>) {
  const { clearance_fee, clearance_weight, exchange_rate } = record;
  return DEFAULT_SYMBOL + formatCurrency(clearance_fee * clearance_weight * exchange_rate);
}

function calculateTotal(record: Record<string, any>) {
  const {
    freight_fee, freight_weight, commission_fee, commission_weight, clearance_fee, 
    clearance_weight, additional_fee, other_fee, exchange_rate
  } = record;

  const value1 = freight_fee * freight_weight;
  const value2 = commission_fee * commission_weight;
  const value3 = clearance_fee * clearance_weight;
  const value = ((value1 + value2 + value3 + additional_fee) * exchange_rate) + other_fee;

  return DEFAULT_SYMBOL + formatCurrency(value);
}

export default AirCargoView;
