import { FC, useState } from "react";
import styled from "styled-components";
import { Form, List, Input, Button, Popconfirm, Select } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import TableTemplate from "../../components/compounds/TableTemplate";
import { ICustomComponentProps } from "../../components/basics/BasicForm";

const { useFormInstance } = Form; // https://ant.design/components/form#formuseforminstance
const { Item } = List;
const { Search } = Input;
const { Option } = Select;

const Customers: FC = () => {
  return (
    <TableTemplate 
      collectionName="Customers"
      columns={[
        { dataIndex: "", title: "" }
      ]}
      view={props => {
        const { values } = props;
        return (
          <ViewContainer>
            {/* TODO */}
          </ViewContainer>
        );
      }}
      form={[
        { key: 'name', label: 'Nama', required: true },
        { key: 'company', label: 'Perusahaan' },
        { key: 'address', label: 'Alamat' },
        { key: 'city', label: 'Kota' },
        { key: 'zip_code', label: 'Kode Pos' },
        { key: 'office_number', label: 'Nomor Kantor' },
        { key: 'phone_number', label: 'Nomor HP' },
        { key: 'home_number', label: 'Nomor Telepon' },
        { key: 'contact_person', label: 'Orang Kontak' },
        { key: 'email', label: 'Email' },
        { type: 'divider' },
        { key: 'measurement_details', label: 'Keterangan Ukuran' },
        { key: 'transport_details', label: 'Keterangan Kirim', type: 'select', items: 'Expeditions' },
        { key: 'others', label: 'Lain-Lain' },
        'pagebreak',
        { key: 'markings', type: 'custom', render: MarkingTable },
        'pagebreak',
        { key: 'details', type: 'custom', render: DetailsTable }
      ]} />
  );
}

const MarkingTable: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const form = useFormInstance();
  const [markingInput, setMarkingInput] = useState('');

  const handleChange = (markings: Array<string>) => {
    form.setFieldsValue({ ...form.getFieldsValue(true), markings });
  }

  // TODO: Fix in the case where the initialValues is 'undefined' instead 
  //       of an object with a key of 'marking' and a value of empty array.

  return (
    <MarkingContainer>
      <div>
        <Input 
          placeholder="Marking" 
          value={markingInput} 
          onChange={e => setMarkingInput(e.target.value)} />
        <Button 
          icon={<PlusOutlined />}
          onClick={() => handleChange([...value, markingInput])}> 
          Add
        </Button>
      </div>
      <List
        size="small"
        dataSource={value}
        loading={value === undefined}
        renderItem={(item, i) => (
          <Item key={i} actions={[
            <Popconfirm 
              title='Yakin di hapus?'
              placement="left"
              onCancel={e => e?.stopPropagation()}
              onConfirm={e => {
                e?.stopPropagation();
                handleChange(value.filter((i: string) => i !== item));
              }}>
              <Button onClick={e => e.stopPropagation()}>Delete</Button>
            </Popconfirm>
          ]}>
            {item as string}
          </Item>
        )} />
    </MarkingContainer>
  );
}

const DetailsTable: FC<ICustomComponentProps> = props => {
  const { value } = props;
  return (
    <DetailsContainer>
      <div>
        <Input placeholder="Keterangan Barang" />
        <Button>Add</Button>
      </div>
      <List />
    </DetailsContainer>
  );
}

export default Customers;

const ViewContainer = styled.div`
  // TODO
`;

const MarkingContainer = styled.div`
  > div:first-child {
    display: flex;
  }
`;

const DetailsContainer = styled.div`
  > div:first-child {
    display: flex;
  }
`;
