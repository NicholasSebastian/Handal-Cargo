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
  dependencies: ['muat_fee', 'additional_fee', 'other_fee', 'clearance_fee', 'exchange_rate'],
  calculateValue: ([muat_fee, additional_fee, other_fee, clearance_fee, exchange_rate]) => {
    const value = (muat_fee + additional_fee + other_fee + clearance_fee) * exchange_rate;
    return formatCurrency(value.toString());
  },
  defaultValue: 0,
  prefix: 'Rp.'
});

const fees = [
  { key: 'muat_fee', label: 'Biaya Muat' },
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

const SeaFreightForm: HandledFormProps = {
  labelSpan: 12,
  twoColumns: true,
  items: [
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
    { key: 'clearance_fee', label: 'Biaya Custom Clearance', type: 'currency', defaultValue: 0, required: true },
    { type: 'custom', render: DisplayTotal },
    'pagebreak',
    { key: 'markings', type: 'custom', render: MarkingTable },
    gap,
    { type: 'custom', render: MarkingTableDetails }
  ]
};

export default SeaFreightForm;
