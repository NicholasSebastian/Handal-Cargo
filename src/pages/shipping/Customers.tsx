import { FC, Fragment, useState } from "react";
import styled from "styled-components";
import { Table, List, Input, Button, Popconfirm, Select } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import TableTemplate from "../../components/compounds/TableTemplate";

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
        'pagebreak',
        { key: 'measurement_details', label: 'Keterangan Ukuran' },
        { key: 'transport_details', label: 'Keterangan Kirim', type: 'select', items: 'Expeditions' },
        { key: 'others', label: 'Lain-Lain' },
        { type: 'divider' },
        { type: 'custom', render: MarkingTable},
        'pagebreak',
        { type: 'custom', render: DetailsTable}
      ]} />
  );
}

const MarkingTable: FC = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [searchBy, setSearchBy] = useState('container');
  return (
    <MarkingContainer>
      <div>
        <div>
          {showHistory ? (
            <Fragment>
              <Search allowClear 
                placeholder="Cari" 
                onSearch={val => console.log(val)}
                style={{ width: '150px' }} />
              <Select 
                value={searchBy} 
                onChange={val => setSearchBy(val)}>
                <Option value='container'>Search by Container</Option>
                <Option value='marking'>Search by Marking</Option>
              </Select>
            </Fragment>
          ) : (
            <Fragment>
              <Input 
                placeholder="Marking"
                style={{ width: '118px' }} />
              <Button 
                icon={<PlusOutlined />} // TODO: add the new marking item.
                onClick={() => console.log('TODO')}> 
                Add
              </Button>
            </Fragment>
          )}
        </div>
        <Button onClick={() => setShowHistory(state => !state)}>
          {showHistory ? 'Lihat Marking Saat Ini' : 'Lihat Riwayat Marking'}
        </Button>
      </div>
      {showHistory ? (
        <Table /* TODO: display past markings */ />
      ) : (
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
                  // TODO: delete the marking item.
                }}>
                <Button onClick={e => e.stopPropagation()}>Delete</Button>
              </Popconfirm>
            ]}>
              {/* TODO: render list items. */}
            </Item>
          )} />
      )}
    </MarkingContainer>
  );
}

const DetailsTable: FC = () => {
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
    justify-content: space-between;

    > div:first-child {
      display: flex;
    }
  }
`;

const DetailsContainer = styled.div`
  > div:first-child {
    display: flex;
  }
`;
