import { RenderItem } from "../../../components/basics/BasicForm";
import createDependentValue from "../../../components/basics/DependentValue";
import { HandledFormProps } from "../../../components/compounds/TableTemplate";
import MarkingTable from "./MarkingTable";
import MarkingTableDetails from "./MarkingTableDetails";
import { formatCurrency } from "../../../utils";

const gap: RenderItem = { type: 'custom', render: () => <div /> };

const DisplayDateDiff = createDependentValue({
  label: 'Lama Tiba',
  dependencies: ['arrival_date', 'muat_date'], 
  calculateValue: ([arrival_date, muat_date]) => arrival_date?.diff(muat_date, "days"), 
  defaultValue: 0,
  suffix: 'hari'
});

const DisplayTotal = createDependentValue({
  label: 'Total Biaya (Rp.)',
  dependencies: [
    'freight_fee', 'freight_weight',
    'commission_fee', 'commission_weight',
    'clearance_fee', 'clearance_weight',
    'additional_fee', 'other_fee', 'exchange_rate'
  ],
  calculateValue: ([
    freight_fee, freight_weight, 
    commission_fee, commission_weight, 
    clearance_fee, clearance_weight, 
    additional_fee, other_fee, exchange_rate
  ]) => {
    const value1 = freight_fee * freight_weight;
    const value2 = commission_fee * commission_weight;
    const value3 = clearance_fee * clearance_weight;
    const value = (value1 + value2 + value3 + additional_fee + other_fee) * exchange_rate;
    return formatCurrency(value.toString());
  },
  defaultValue: 0,
  prefix: 'Rp.'
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
    field3: 'Total Freight'
  }
]
.map(row => ([
  { ...row.field1, type: 'currency', defaultValue: 0, required: true } as RenderItem,
  {
    type: 'custom',
    render: createDependentValue({
      label: `${row.field3} (Rp.)`,
      dependencies: [row.field1.key, row.field2.key, 'exchange_rate'],
      calculateValue: ([field1Key, field2Key, exchange_rate]) => {
        const value = field1Key * field2Key * exchange_rate;
        return formatCurrency(value.toString());
      },
      defaultValue: 0,
      prefix: 'Rp.'
    })
  } as RenderItem,
  { ...row.field2, type: 'number', defaultValue: 0, required: true } as RenderItem,
  gap
]))
.flat();

const moreFees = [
  { key: 'additional_fee', label: 'Biaya Tambahan' },
  { key: 'other_fee', label: 'Biaya Lain-Lain' }
]
.map(field => ([
  { ...field, type: 'currency', defaultValue: 0, required: true } as RenderItem,
  {
    type: 'custom',
    render: createDependentValue({
      label: `${field.label} (Rp.)`,
      dependencies: [field.key, 'exchange_rate'],
      calculateValue: ([fieldKey, exchange_rate]) => {
        const value = fieldKey * exchange_rate;
        return formatCurrency(value.toString());
      },
      defaultValue: 0,
      prefix: 'Rp.'
    })
  } as RenderItem
]))
.flat();

const AirCargoForm: HandledFormProps = {
  labelSpan: 12,
  twoColumns: true,
  items: [
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
    ...moreFees,
    gap,
    { type: 'custom', render: DisplayTotal },
    'pagebreak',
    { key: 'markings', type: 'custom', render: MarkingTable },
    gap,
    { type: 'custom', render: MarkingTableDetails }
  ]
};

export default AirCargoForm;
