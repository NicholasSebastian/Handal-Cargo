import { FC } from "react";
import { ICustomComponentProps } from "../../../components/basics/BasicForm";
import Table, { MarkingField, fieldsToMarkingColumns } from "../../../components/specialized/ShippingTemplate/MarkingTable";

const fields: Array<MarkingField> = [
  { 
    key: 'listkg', 
    label: 'List (kg)', 
    render: value => value && (value + ' kg'),
    parser: value => value ? parseFloat(value) : undefined
  },
  { 
    key: 'hbkg', 
    label: 'HB (kg)', 
    render: value => value && (value + ' kg'),
    parser: value => value ? parseFloat(value) : undefined
  },
  { 
    key: 'standardkg', 
    label: 'Standard (kg)', 
    render: value => value && (value + ' kg'), 
    width: 105,
    parser: value => value ? parseFloat(value) : undefined
  },
  { 
    key: 'volume_charge', 
    label: 'Volume Charge', 
    render: value => value && (value + ' kg'), 
    width: 115,
    parser: (_, record) => (record.standardkg ? parseFloat(record.standardkg) : 0) - (record.hbkg ? parseFloat(record.hbkg) : 0)
  }
];

const MarkingTable: FC<ICustomComponentProps> = props => (
  <Table
    {...props}
    width={950}
    fields={fields} />
);

export default MarkingTable;
export const columns = fieldsToMarkingColumns(fields);
