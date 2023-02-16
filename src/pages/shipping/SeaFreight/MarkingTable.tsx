import { FC } from "react";
import { ICustomComponentProps } from "../../../components/basics/BasicForm";
import Table, { MarkingField, fieldsToMarkingColumns } from "../../../components/specialized/ShippingTemplate/MarkingTable";

const fields: Array<MarkingField> = [
  { 
    key: 'listm3', 
    label: 'List (m³)', 
    render: value => value && (value + ' m³'),
    parser: value => value ? parseFloat(value) : undefined
  },
  { 
    key: 'listkg', 
    label: 'List (kg)', 
    render: value => value && (value + ' kg'),
    parser: value => value ? parseFloat(value) : undefined 
  },
  { 
    key: 'dlistm3', 
    label: 'DList (m³)', 
    render: value => value && (value + ' m³'),
    parser: value => value ? parseFloat(value) : undefined 
  },
  { 
    key: 'dlistkg', 
    label: 'DList (kg)', 
    render: value => value && (value + ' kg'),
    parser: value => value ? parseFloat(value) : undefined 
  },
  { 
    key: 'hbm3', 
    label: 'HB (m³)', 
    render: value => value && (value + ' m³'),
    parser: value => value ? parseFloat(value) : undefined 
  },
  { 
    key: 'hbkg', 
    label: 'HB (kg)', 
    render: value => value && (value + ' kg'),
    parser: value => value ? parseFloat(value) : undefined 
  },
  { 
    key: 'custm3',
    label: 'Cust (m³)', 
    render: value => value && (value + ' m³'),
    parser: value => value ? parseFloat(value) : undefined 
  },
  { 
    key: 'custkg', 
    label: 'Cust (kg)', 
    render: value => value && (value + ' kg'),
    parser: value => value ? parseFloat(value) : undefined 
  }
];

const MarkingTable: FC<ICustomComponentProps> = props => (
  <Table
    {...props}
    width={1280}
    fields={fields} />
);

export default MarkingTable;
export const columns = fieldsToMarkingColumns(fields);
