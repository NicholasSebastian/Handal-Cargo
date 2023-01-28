import { FC, Fragment, useState } from "react";
import styled from "styled-components";
import { Table, List, Input, Button, Popconfirm, Select } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import TableTemplate from "../../components/compounds/TableTemplate";
import { ICustomComponentProps } from "../../components/basics/BasicForm";

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
  const { value, onChange } = props; // treat this as the state of the component.
  const [searchBy, setSearchBy] = useState('container');
  return (
    <MarkingContainer>
      <div>
        <Input placeholder="Marking" />
        <Button 
          icon={<PlusOutlined />} // TODO: add the new local marking item.
          onClick={() => console.log('TODO')}> 
          Add
        </Button>
      </div>
      <List
        size="small"
        dataSource={[]}
        loading={false}
        renderItem={item => (
          <Item actions={[
            <Popconfirm 
              title='Yakin di hapus?'
              placement="left"
              onCancel={e => e?.stopPropagation()}
              onConfirm={e => {
                e?.stopPropagation();
                // TODO: delete the local marking item.
              }}>
              <Button onClick={e => e.stopPropagation()}>Delete</Button>
            </Popconfirm>
          ]}>
            {/* TODO: render list items. */}
          </Item>
        )} />
    </MarkingContainer>
  );
}

const DetailsTable: FC<ICustomComponentProps> = props => {
  const { value, onChange } = props;
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
