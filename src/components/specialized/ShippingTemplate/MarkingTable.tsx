import { FC, useState, useReducer, useMemo } from "react";
import styled from "styled-components";
import { Form, Table, InputNumber, Button, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import { PlusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { ICustomComponentProps } from "../../basics/BasicForm";
import SearchMarking from "../../specialized/SearchMarking";

const { useFormInstance } = Form;
const check = <CheckOutlined style={{ color: 'green' }} />
const cross = <CloseOutlined style={{ color:'red' }} />

function fieldsToMarkingColumns(fields: Array<MarkingField>): ColumnsType<any> {
  return [
    { dataIndex: 'marking', title: 'Marking', fixed: 'left' },
    { dataIndex: 'quantity', title: 'Kuantitas' },
    ...fields.map(field => ({ dataIndex: field.key, title: field.label, width: field.width, render: field.render })),
    { dataIndex: 'paid', title: 'Lunas', render: value => value ? check : cross },
    { dataIndex: 'remainder', title: 'Sisa', render: (value, record) => value ? value : record.quantity },
    { dataIndex: 'travel_documents', title: 'Surat Jalan', width: 90, render: value => value ?? 0 },
    { dataIndex: 'invoices', title: 'Faktur', render: value => value ?? 0 }
  ];
}

function createInitialState(fields: Array<MarkingField>): Record<string, string> {
  return Object.fromEntries(fields.map(field => [field.key, '']));
}

function reducer(state: Record<string, string>, action: DispatchArg) {
  if (action) {
    // The new state is to have the designated key-value pair updated.
    return {
      ...state,
      [action.key]: action.value
    };
  }
  else {
    // The new state is to have all the values set to an empty string.
    const newEntries = Object.keys(state).map(key => [key, '']);
    return Object.fromEntries(newEntries);
  }
}

const MarkingTable: FC<IMarkingTableProps> = props => {
  const { fields, value, width } = props;
  const form = useFormInstance();
  const columns = useMemo(() => fieldsToMarkingColumns(fields), []);

  const [marking, setMarking] = useState<string>();
  const [quantity, setQuantity] = useState('0');
  const [otherState, setOtherState] = useReducer(reducer, fields, createInitialState);

  const handleChange = (markings: Array<any>) => {
    form.setFieldsValue({ ...form.getFieldsValue(true), markings });
  }

  const handleAdd = () => {
    if (marking === undefined || quantity.length === 0) {
      message.error("Marking dan Kuantitas harus diisi.");
    }
    else if (value?.some((item: any) => item.marking === marking)) {
      message.error(`Marking '${marking}' sudah ada.`);
    }
    else {
      const newValue = { 
        marking, 
        quantity: parseInt(quantity), 
        ...otherState
      };

      if (value) 
        handleChange([...value, newValue]);
      else 
        handleChange([newValue]);

      clearInputs();
    }
  }

  const handleDelete = (index: number) => {
    handleChange(value.filter((_: never, i: number) => i !== index));
  }

  const clearInputs = () => {
    setQuantity('0');
    setOtherState(null);
  }

  return (
    <Container columns={Math.min(columns.length, 4)}>
      <div>
        <SearchMarking 
          onChange={setMarking} />
        <InputNumber 
          placeholder="Kuantitas" 
          value={quantity} 
          onChange={setQuantity} />
        <Button
          icon={<PlusOutlined />}
          onClick={handleAdd}>
          Baru
        </Button>
      </div>
      <div>
        {fields.map(field => (
          <InputNumber
            placeholder={field.label}
            value={otherState[field.key]}
            onChange={value => setOtherState({ key: field.key, value })} />
        ))}
      </div>
      <Table bordered 
        size="small"
        scroll={{ x: width }}
        pagination={false}
        dataSource={value}
        columns={[
          ...columns,
          {
            fixed: 'right',
            width: 92,
            render: (_, __, i) => (
              <Button onClick={() => handleDelete(i)}>Hapus</Button>
            )
          }
        ]} />
    </Container>
  );
}

export { fieldsToMarkingColumns };
export type { MarkingField };
export default MarkingTable;

const Container = styled.div<IStyleProps>`
  width: 733px; // Because of a stupid bug, this has to be an absolute value.

  > div:first-child {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    > *:not(:last-child) {
      width: calc(50% - 50px);
    }
  }

  > div:nth-child(2) {
    display: grid;
    grid-template-columns: repeat(${props => props.columns}, 1fr);
    grid-gap: 10px;
    margin-bottom: 10px;

    > * {
      width: 100%;
    }
  }
`;

interface IMarkingTableProps extends ICustomComponentProps {
  fields: Array<MarkingField>
  width: number
}

interface IStyleProps {
  columns: number
}

interface MarkingField {
  key: string
  label: string
  render: (value: any) => any
  parser: (value: any, record: Record<string, string>) => any
  width?: number
}

type DispatchArg = { key: string, value: any } | null;
