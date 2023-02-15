import { FC, useState } from "react";
import styled from "styled-components";
import { Form, Table, InputNumber, Button, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import { PlusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { ICustomComponentProps } from "../../../components/basics/BasicForm";
import SearchMarking from "../../../components/specialized/SearchMarking";

const { useFormInstance } = Form;
const check = <CheckOutlined style={{ color: 'green' }} />
const cross = <CloseOutlined style={{ color:'red' }} />

const columns: ColumnsType<any> = [
  { dataIndex: 'marking', title: 'Marking', fixed: 'left' },
  { dataIndex: 'quantity', title: 'Kuantitas' },
  { dataIndex: 'listkg', title: 'List (kg)', render: value => value && (value + ' kg') },
  { dataIndex: 'hbkg', title: 'HB (kg)', render: value => value && (value + ' kg') },
  { dataIndex: 'standardkg', title: 'Standard (kg)', render: value => value && (value + ' kg'), width: 105 },
  { dataIndex: 'volume_charge', title: 'Volume Charge', render: value => value && (value + ' kg'), width: 115 },
  { dataIndex: 'paid', title: 'Lunas', render: value => value ? check : cross },
  { dataIndex: 'remainder', title: 'Sisa', render: (value, record) => value ? value : record.quantity },
  { dataIndex: 'travel_documents', title: 'Surat Jalan', width: 90, render: value => value ?? 0 },
  { dataIndex: 'invoices', title: 'Faktur', render: value => value ?? 0 }
];

const MarkingTable: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const form = useFormInstance();

  const [marking, setMarking] = useState<string>();
  const [quantity, setQuantity] = useState('0');
  const [listkg, setListkg] = useState('');
  const [hbkg, setHbkg] = useState('');
  const [standardkg, setStandardkg] = useState('');

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
      const qty = parseInt(quantity);
      const newValue = { 
        marking, 
        quantity: qty, 
        listkg: listkg ? parseFloat(listkg) : undefined, 
        hbkg: hbkg ? parseFloat(hbkg) : undefined, 
        standardkg: standardkg ? parseFloat(standardkg) : undefined,
        volume_charge: (standardkg ? parseFloat(standardkg) : 0) - (hbkg ? parseFloat(hbkg) : 0)
      };
      if (value) {
        handleChange([...value, newValue]);
      }
      else {
        handleChange([newValue]);
      }
      clearInputs();
    }
  }

  const handleDelete = (index: number) => {
    handleChange(value.filter((_: never, i: number) => i !== index));
  }

  const clearInputs = () => {
    setQuantity('0');
    setListkg('');
    setHbkg('');
    setStandardkg('');
  }

  return (
    <Container>
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
        <InputNumber 
          placeholder="List (kg)"
          value={listkg}
          onChange={setListkg} />
        <InputNumber 
          placeholder="HB (kg)"
          value={hbkg}
          onChange={setHbkg} />
        <InputNumber 
          placeholder="Standard (kg)"
          value={standardkg}
          onChange={setStandardkg} />
      </div>
      <Table bordered 
        size="small"
        scroll={{ x: 950 }}
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

export { columns };
export default MarkingTable;

const Container = styled.div`
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
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    margin-bottom: 10px;

    > * {
      width: 100%;
    }
  }
`;
