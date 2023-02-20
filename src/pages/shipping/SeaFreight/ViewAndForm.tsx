import createDependentValue from "../../../components/basics/DependentValue";
import { gap } from "../../../components/basics/BasicView";
import { RenderItem } from "../../../components/basics/BasicForm";
import { IViewAndFormStuff } from "../../../components/compounds/ShippingTemplate";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import { dateToString, formatCurrency } from "../../../utils";

function formatExchangeRate(value: any, record: Record<string, any>) {
  return `${DEFAULT_SYMBOL}${formatCurrency(value)} / ${record.currency}`;
}

function formatForeignCurrency(value: any, record: Record<string, any>) {
  const { exchange_rate } = record;
  return DEFAULT_SYMBOL + formatCurrency(value * exchange_rate);
}

function calculateTotal(record: Record<string, any>) {
  const { muat_fee, additional_fee, clearance_fee, other_fee, exchange_rate } = record;
  const value = ((muat_fee + additional_fee + clearance_fee) * exchange_rate) + other_fee;
  return DEFAULT_SYMBOL + formatCurrency(value);
}

function toDisplayRp(field: any) {
  return createDependentValue({
    label: `${field.label} (${DEFAULT_SYMBOL})`,
    dependencies: [field.key, 'exchange_rate'],
    calculateValue: ([fieldKey, exchange_rate]) => {
      const value: number = fieldKey * exchange_rate;
      return formatCurrency(value);
    },
    defaultValue: 0,
    prefix: DEFAULT_SYMBOL
  });
}

const DisplayDateDiff = createDependentValue({
  label: 'Lama Tiba',
  dependencies: ['arrival_date', 'muat_date'], 
  calculateValue: ([arrival_date, muat_date]) => arrival_date?.diff(muat_date, "days"), 
  defaultValue: 0,
  suffix: 'hari'
});

const DisplayTotal = createDependentValue({
  label: `Total Biaya (${DEFAULT_SYMBOL})`,
  labelSpan: 12,
  dependencies: ['muat_fee', 'additional_fee', 'clearance_fee', 'other_fee', 'exchange_rate'],
  calculateValue: ([muat_fee, additional_fee, clearance_fee, other_fee, exchange_rate]) => {
    const value: number = ((muat_fee + additional_fee + clearance_fee) * exchange_rate) + other_fee;
    return formatCurrency(value);
  },
  defaultValue: 0,
  prefix: DEFAULT_SYMBOL
});

const fees = [
  { key: 'muat_fee', label: 'Biaya Muat' },
  { key: 'additional_fee', label: 'Biaya Tambahan' },
  { key: 'clearance_fee', label: 'B. Custom Clearance' }
]
.map(field => ([
  { ...field, type: 'currency', defaultValue: 0, required: true } as RenderItem,
  { type: 'custom', render: toDisplayRp(field) } as RenderItem
]))
.flat();

const viewAndFormStuff: IViewAndFormStuff = {
  profitLossPrintPreset: 'sf-rugi-laba',
  viewItems: [
    { key: 'container_number', label: 'Nomor Container' },
    { key: 'muat_date', label: 'Tanggal Muat', render: dateToString },
    { key: 'container_group', label: 'Kelompok Container' },
    { key: 'arrival_date', label: 'Tanggal Tiba', render: dateToString },
    { key: 'carrier', label: 'Shipper' },
    { key: 'bl_date', label: 'Tanggal BL', render: dateToString },
    { key: 'route', label: 'Rute' },
    { key: 'currency', label: 'Mata Uang' },
    { key: 'handler', label: 'Pengurus' },
    { key: 'exchange_rate', label: 'Kurs', render: formatExchangeRate },
    { key: 'muat_fee', label: 'Biaya Muat', render: formatForeignCurrency },
    { key: 'additional_fee', label: 'Biaya Tambahan', render: formatForeignCurrency },
    { key: 'clearance_fee', label: 'Biaya Custom Clearance', render: formatForeignCurrency },
    { key: 'other_fee', label: 'Biaya Lain-Lain', render: value => DEFAULT_SYMBOL + formatCurrency(value) },
    gap,
    { label: 'Total Biaya', render: (_, record) => calculateTotal(record) },
    gap,
    { key: 'description', label: 'Keterangan' }
  ],
  formItems: [
    { key: 'container_number', label: 'Nomor Container', required: true },
    { key: 'container_group', label: 'Kelompok Container', type: 'select', items: 'ContainerGroups' },
    { key: 'muat_date', label: 'Tanggal Muat', type: 'date' },
    { key: 'carrier', label: 'Shipper', type: 'select', items: 'Carriers' },
    { key: 'arrival_date', label: 'Tanggal Tiba', type: 'date' },
    { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
    { key: 'bl_date', label: 'Tanggal BL', type: 'date' },
    { key: 'handler', label: 'Pengurus', type: 'select', items: 'Handlers' },
    { type: 'custom', render: DisplayDateDiff },
    { key: 'description', label: 'Keterangan', type: 'textarea' },
    'pagebreak',
    { key: 'currency', label: 'Mata Uang', type: 'select', items: 'Currencies', required: true },
    { key: 'exchange_rate', label: 'Kurs', type: 'number', defaultValue: 1, required: true },
    ...fees,
    { key: 'other_fee', label: 'Biaya Lain-Lain', type: 'currency', prefix: DEFAULT_SYMBOL, defaultValue: 0, required: true },
    { type: 'custom', render: DisplayTotal }
  ]
};

export { toDisplayRp };
export default viewAndFormStuff;
