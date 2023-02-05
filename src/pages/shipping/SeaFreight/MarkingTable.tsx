import { FC, useState } from "react";
import styled from "styled-components";
import { Form, Table, InputNumber, Button, message } from "antd";
import { PlusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { ICustomComponentProps } from "../../../components/basics/BasicForm";
import SearchMarking from "../../../components/basics/SearchMarking";

const { useFormInstance } = Form;
const check = <CheckOutlined style={{ color: 'green' }} />
const cross = <CloseOutlined style={{ color:'red' }} />

// TODO: The 'Lunas' column should display true/false, signifying whether the marking has been paid for through Entri Faktur.
// TODO: The 'Sisa' column should display an integer, signifying the quantity that has not been sent through Surat Jalan.
// TODO: The 'Surat Jalan' column should display an integer, signifying the number of surat jalan that has been made.
// TODO: The 'Faktur' column should display an integer, signifying the number of faktur (invoices) that has been made.

const MarkingTable: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const form = useFormInstance();

  const [marking, setMarking] = useState<string>();
  const [quantity, setQuantity] = useState('0');
  const [listm3, setListm3] = useState('');
  const [listkg, setListkg] = useState('');
  const [dlistm3, setDlistm3] = useState('');
  const [dlistkg, setDlistkg] = useState('');
  const [hbm3, setHbm3] = useState('');
  const [hbkg, setHbkg] = useState('');
  const [custm3, setCustm3] = useState('');
  const [custkg, setCustkg] = useState('');

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
        listm3: listm3 ? parseFloat(listm3) : undefined, 
        listkg: listkg ? parseFloat(listkg) : undefined, 
        dlistm3: dlistm3 ? parseFloat(dlistm3) : undefined, 
        dlistkg: dlistkg ? parseFloat(dlistkg) : undefined, 
        hbm3: hbm3 ? parseFloat(hbm3) : undefined, 
        hbkg: hbkg ? parseFloat(hbkg) : undefined, 
        custm3: custm3 ? parseFloat(custm3) : undefined, 
        custkg: custkg ? parseFloat(custkg) : undefined,
        remainder: qty
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
    setListm3('');
    setListkg('');
    setDlistm3('');
    setDlistkg('');
    setHbm3('');
    setHbkg('');
    setCustm3('');
    setCustkg('');
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
          placeholder="List (m³)"
          value={listm3}
          onChange={setListm3} />
        <InputNumber 
          placeholder="DList (m³)"
          value={dlistm3}
          onChange={setDlistm3} />
        <InputNumber 
          placeholder="HB (m³)"
          value={hbm3}
          onChange={setHbm3} />
        <InputNumber 
          placeholder="Cust (m³)"
          value={custm3}
          onChange={setCustm3} />
        <InputNumber 
          placeholder="List (kg)"
          value={listkg}
          onChange={setListkg} />
        <InputNumber 
          placeholder="DList (kg)"
          value={dlistkg}
          onChange={setDlistkg} />
        <InputNumber 
          placeholder="HB (kg)"
          value={hbkg}
          onChange={setHbkg} />
        <InputNumber 
          placeholder="Cust (kg)"
          value={custkg}
          onChange={setCustkg} />
      </div>
      <Table bordered 
        size="small"
        scroll={{ x: 1280 }}
        pagination={false}
        dataSource={value}
        columns={[
          { dataIndex: 'marking', title: 'Marking' },
          { dataIndex: 'quantity', title: 'Kuantitas' },
          { dataIndex: 'listm3', title: 'List (m³)', render: value => value && (value + ' m³') },
          { dataIndex: 'listkg', title: 'List (kg)', render: value => value && (value + ' kg') },
          { dataIndex: 'dlistm3', title: 'DList (m³)', render: value => value && (value + ' m³') },
          { dataIndex: 'dlistkg', title: 'DList (kg)', render: value => value && (value + ' kg') },
          { dataIndex: 'hbm3', title: 'HB (m³)', render: value => value && (value + ' m³') },
          { dataIndex: 'hbkg', title: 'HB (kg)', render: value => value && (value + ' kg') },
          { dataIndex: 'custm3', title: 'Cust (m³)', render: value => value && (value + ' m³') },
          { dataIndex: 'custkg', title: 'Cust (kg)', render: value => value && (value + ' kg') },
          { dataIndex: 'paid', title: 'Lunas', render: value => value ? check : cross },
          { dataIndex: 'remainder', title: 'Sisa' },
          { dataIndex: 'travel_documents', title: 'Surat Jalan', width: 100 },
          { dataIndex: 'invoices', title: 'Faktur' },
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

export default MarkingTable;

const Container = styled.div`
  width: 750px; // Because of a stupid bug, this has to be an absolute value.

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
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
    margin-bottom: 10px;

    > * {
      width: 100%;
    }
  }
`;
