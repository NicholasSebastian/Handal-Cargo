import styled from "styled-components";
import { RenderItem } from "../../../components/basics/BasicForm";
import createDependentValue from "../../../components/basics/DependentValue";
import { HandledFormProps } from "../../../components/compounds/TableTemplate";
import MarkingTable from "./MarkingTable";
import { formatCurrency } from "../../../utils";

const SeaFreightForm: HandledFormProps = {
  labelSpan: 11,
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
    { 
      type: 'custom', 
      render: createDependentValue({
        label: 'Lama Tiba',
        dependencies: ['arrival_date', 'muat_date'], 
        calculateValue: ([arrival_date, muat_date]) => arrival_date?.diff(muat_date, "days"), 
        defaultValue: 0,
        suffix: 'hari'
      })
    },
    { key: 'description', label: 'Keterangan', type: 'textarea' },
    'pagebreak',
    { key: 'currency', label: 'Mata Uang', type: 'select', items: 'Currencies', required: true },
    { key: 'exchange_rate', label: 'Kurs', type: 'number', defaultValue: 1, required: true },
    ...[
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
    .flat(),
    { key: 'clearance_fee', label: 'B. Custom Clearance', type: 'currency', defaultValue: 0, required: true },
    { 
      type: 'custom', 
      render: createDependentValue({
        label: 'Total Biaya (Rp.)',
        dependencies: ['muat_fee', 'additional_fee', 'other_fee', 'exchange_rate'],
        calculateValue: ([muat_fee, additional_fee, other_fee, exchange_rate]) => {
          const value = (muat_fee + additional_fee + other_fee) * exchange_rate;
          return formatCurrency(value.toString());
        },
        defaultValue: 0,
        prefix: 'Rp.'
      })
    },
    'pagebreak',
    { key: 'markings', type: 'custom', render: MarkingTable },
    { type: 'divider' }, // This is here to brute-force an issue with the 'display: grid'.
    { type: 'custom', render: () => (
      <MarkingTableDetails>
        {[
          { key: 'listm3', label: 'Total Kubikasi (List)', suffix: 'm³' },
          { key: 'listkg', label: 'Total Berat (List)', suffix: 'kg' },
          { key: 'dlistm3', label: 'Total Kubikasi (DList)', suffix: 'm³' },
          { key: 'dlistkg', label: 'Total Berat (DList)', suffix: 'kg' },
          { key: 'hbm3', label: 'Total Kubikasi (HB)', suffix: 'm³' },
          { key: 'hbkg', label: 'Total Berat (HB)', suffix: 'kg' },
          { key: 'custm3', label: 'Total Kubikasi (Cust)', suffix: 'm³' },
          { key: 'custkg', label: 'Total Berat (Cust)', suffix: 'kg' },
          { key: 'quantity', label: 'Total Muatan', suffix: 'Colly / Ball' }
        ]
        .map(field => createDependentValue({
          label: field.label,
          suffix: field.suffix,
          labelSpan: 12,
          defaultValue: 0,
          dependencies: ['markings'],
          calculateValue: ([markings]) => {
            return markings.reduce((acc: number, marking: any) => acc + marking[field.key], 0);
          }
        }))
        .map(Display => <Display />)}
      </MarkingTableDetails>
    )}
  ]
};

export default SeaFreightForm;

const MarkingTableDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 10px;
`;
