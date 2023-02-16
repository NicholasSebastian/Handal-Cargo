import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import { RenderItem } from "../../../components/basics/BasicForm";
import { gap as viewGap } from "../../../components/basics/BasicView";
import { gap as formGap } from "../../../components/basics/BasicForm";
import createDependentValue from "../../../components/basics/DependentValue";
import { IViewAndFormStuff } from "../../../components/compounds/ShippingTemplate";
import { dateToString, formatCurrency } from "../../../utils";

function formatExchangeRate(value: any, record: Record<string, any>) {
  return `${DEFAULT_SYMBOL}${formatCurrency(value)} / ${record.currency}`;
}

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

const DisplayDateDiff = createDependentValue({
  label: 'Lama Tiba',
  dependencies: ['arrival_date', 'muat_date'], 
  calculateValue: ([arrival_date, muat_date]) => arrival_date?.diff(muat_date, "days"), 
  defaultValue: 0,
  suffix: 'hari'
});

const DisplayAdditionalFeeRp = createDependentValue({
  label: `Biaya Tambahan (${DEFAULT_SYMBOL})`,
  dependencies: ['additional_fee', 'exchange_rate'],
  calculateValue: ([fieldKey, exchange_rate]) => {
    const value = fieldKey * exchange_rate;
    return formatCurrency(value.toString());
  },
  defaultValue: 0,
  prefix: DEFAULT_SYMBOL
});

const toDisplayPrice = (label: string, field1: any, field2: any) => createDependentValue({
  label: `${label} (${DEFAULT_SYMBOL})`,
  dependencies: [field1.key, field2.key, 'exchange_rate'],
  calculateValue: ([field1Key, field2Key, exchange_rate]) => {
    const value = field1Key * field2Key * exchange_rate;
    return formatCurrency(value.toString());
  },
  defaultValue: 0,
  prefix: DEFAULT_SYMBOL
});

const DisplayTotal = createDependentValue({
  label: `Total Biaya (${DEFAULT_SYMBOL})`,
  labelSpan: 11,
  dependencies: ['freight_fee', 'freight_weight', 'commission_fee', 'commission_weight', 'clearance_fee', 'clearance_weight', 'additional_fee', 'other_fee', 'exchange_rate'],
  calculateValue: ([freight_fee, freight_weight, commission_fee, commission_weight, clearance_fee, clearance_weight, additional_fee, other_fee, exchange_rate]) => {
    const value1 = freight_fee * freight_weight;
    const value2 = commission_fee * commission_weight;
    const value3 = clearance_fee * clearance_weight;
    const value = ((value1 + value2 + value3 + additional_fee) * exchange_rate) + other_fee;
    return formatCurrency(value.toString());
  },
  defaultValue: 0,
  prefix: DEFAULT_SYMBOL
});

const feeWeightTotal = [
  {
    field1: { key: 'freight_fee', label: 'Freight Charge / kg' },
    field2: { key: 'freight_weight', label: 'Berat Freight (kg)' },
    field3: 'Total Freight'
  },
  {
    field1: { key: 'commission_fee', label: 'Komisi / kg' },
    field2: { key: 'commission_weight', label: 'Berat Komisi (kg)' },
    field3: 'Total Komisi'
  },
  {
    field1: { key: 'clearance_fee', label: 'Biaya Custom Clearance' },
    field2: { key: 'clearance_weight', label: 'Berat Clearance (kg)' },
    field3: 'Total C. Clearance'
  }
]
.map(row => ([
  { ...row.field1, type: 'currency', defaultValue: 0, required: true } as RenderItem,
  { type: 'custom', render: toDisplayPrice(row.field3, row.field1, row.field2) } as RenderItem,
  { ...row.field2, type: 'number', defaultValue: 0, required: true } as RenderItem,
  formGap
]))
.flat();

const viewAndFormStuff: IViewAndFormStuff = {
  profitLossPrintPreset: 'ac-rugi-laba',
  viewItems: [
    { key: 'airwaybill_number', label: 'Nomor Air Waybill' },
    { key: 'muat_date', label: 'Tanggal Muat', render: dateToString },
    { key: 'item_code', label: 'Kode Barang' },
    { key: 'arrival_date', label: 'Tanggal Tiba', render: dateToString },
    { key: 'route', label: 'Rute' },
    { key: 'currency', label: 'Mata Uang' },
    { key: 'plane', label: 'Pesawat' },
    { key: 'exchange_rate', label: 'Kurs', render: formatExchangeRate },
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
    viewGap,
    { key: 'description', label: 'Keterangan' }
  ],
  formItems: [
    { key: 'airwaybill_number', label: 'Nomor Air Waybill', required: true },
    { key: 'item_code', label: 'Kode Barang', required: true },
    { key: 'muat_date', label: 'Tanggal Muat', type: 'date' },
    { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
    { key: 'arrival_date', label: 'Tanggal Tiba', type: 'date' },
    { key: 'plane', label: 'Pesawat', type: 'select', items: 'Planes' },
    { type: 'custom', render: DisplayDateDiff },
    { key: 'description', label: 'Keterangan', type: 'textarea' },
    'pagebreak',
    { key: 'currency', label: 'Mata Uang', type: 'select', items: 'Currencies', required: true },
    { key: 'exchange_rate', label: 'Kurs', type: 'number', defaultValue: 1, required: true },
    ...feeWeightTotal,
    { key: 'additional_fee', label: 'Biaya Tambahan', type: 'currency', defaultValue: 0, required: true },
    { type: 'custom', render: DisplayAdditionalFeeRp },
    { key: 'other_fee', label: 'Biaya Lain-Lain', type: 'currency', prefix: DEFAULT_SYMBOL, defaultValue: 0, required: true },
    { type: 'custom', render: DisplayTotal }
  ]
};

export default viewAndFormStuff;
