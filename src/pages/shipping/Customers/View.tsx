import { FC } from "react";
import styled from "styled-components";
import { Descriptions, Table } from "antd";
import { IInjectedProps } from "../../../components/abstractions/withInitialData";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import { formatCurrency } from "../../../utils";

const { Item } = Descriptions;

const CustomersView: FC<IInjectedProps> = props => {
  const { values } = props;
  return (
    <ViewContainer>
      <Descriptions 
        column={2}
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
          { dataIndex: 'price', title: 'Harga', render: value => DEFAULT_SYMBOL + formatCurrency(value) },
          { dataIndex: 'user', title: 'User' }
        ]} />
    </ViewContainer>
  );
}

export default CustomersView;

const ViewContainer = styled.div`
  width: calc(100% - 100px);

  > *:nth-last-child(2) {
    margin-top: 10px;
    margin-bottom: 30px;
  }

  > *:last-child {
    padding-bottom: 70px;
  }
`;
