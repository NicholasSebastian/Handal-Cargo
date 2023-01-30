import { FC } from "react";
import styled from "styled-components";
import { Descriptions, List, Table } from "antd";
import TableTemplate from "../../../components/compounds/TableTemplate";
import MarkingTable from "./MarkingTable";
import DetailsTable from "./DetailsTable";
import { IData } from "../../../components/abstracts/useTemplateHandlers";

const { Item } = Descriptions;

const Customers: FC = () => {
  return (
    <TableTemplate 
      collectionName="Customers"
      processData={data => {
        const accumulator: Array<IData> = [];
        data?.forEach(item => item.markings.forEach((marking: string) => {
          const { markings, ...rest } = item;
          accumulator.push({ ...rest, marking });
        }));
        return accumulator;
      }}
      columns={[
        { dataIndex: "name", title: "Customer" },
        { dataIndex: "marking", title: "Marking" },
        { dataIndex: "company", title: "Perusahaan" },
        { dataIndex: "office_number", title: "Nomor Kantor" },
        { dataIndex: "phone_number", title: "Nomor HP" },
        { dataIndex: "email", title: "Email" },
        { dataIndex: "status", title: "Status" }
      ]}
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
        { key: 'status', label: 'Status', type: 'boolean' },
        { type: 'divider' },
        { key: 'measurement_details', label: 'Keterangan Ukuran' },
        { key: 'transport_details', label: 'Keterangan Kirim', type: 'select', items: 'Expeditions' },
        { key: 'others', label: 'Lain-Lain' },
        'pagebreak',
        { key: 'markings', type: 'custom', render: MarkingTable },
        'pagebreak',
        { key: 'details', type: 'custom', render: DetailsTable }
      ]}
      view={props => {
        const { values } = props;
        return (
          <ViewContainer>
            <Descriptions 
              column={1}
              labelStyle={{ fontWeight: 500 }}>
              <Item label="Nama">{values.name}</Item>
              <Item label="Perusahaan">{values.company}</Item>
              <Item label="Alamat">{values.address}</Item>
              <Item label="Kota">{values.city}</Item>
              <Item label="Kode Pos">{values.zip_code}</Item>
              <Item label="Nomor Kantor">{values.office_number}</Item>
              <Item label="Nomor HP">{values.phone_number}</Item>
              <Item label="Nomor Telepon">{values.home_number}</Item>
              <Item label="Orang Kontak">{values.contact_person}</Item>
              <Item label="Email">{values.email}</Item>
              <Item label="Status">{values.status ? 'Aktif' : 'Tidak Aktif'}</Item>
              <Item label="Keterangan Ukuran">{values.measurement_details}</Item>
              <Item label="Keterangan Kirim">{values.transport_details}</Item>
              <Item label="Lain-Lain">{values.others}</Item>
            </Descriptions>
            <Table bordered
              size="small"
              pagination={false}
              dataSource={values.markings}
              columns={[{ title: 'Markings' }]} />
            {/* TODO: Customer History table that can be viewed optionally, to display all the past markings.
              Includes an advanced search feature by Customer or by Markings. */}
            <Table bordered
              size="small"
              pagination={false}
              dataSource={values.details}
              columns={[
                { dataIndex: 'productDetail', title: "Keterangan Barang" },
                { dataIndex: 'route', title: 'Rute' },
                { dataIndex: 'transport', title: 'By' },
                { dataIndex: 'price', title: 'Harga' },
                { dataIndex: 'user', title: 'User' }
              ]} />
          </ViewContainer>
        );
      }} />
  );
}

export default Customers;

const ViewContainer = styled.div`
  width: 75%;

  > *:nth-last-child(2) {
    margin-top: 10px;
    margin-bottom: 30px;
  }

  > *:last-child {
    padding-bottom: 70px;
  }
`;
