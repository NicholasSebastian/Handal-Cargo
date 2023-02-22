import { FC, useState } from "react";
import styled from "styled-components";
import { Button, Descriptions, Table, Modal } from "antd";
import { IInjectedProps } from "../../../components/abstractions/withInitialData";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import { formatCurrency } from "../../../utils";
import CustomerHistory from "./History";

const { Item } = Descriptions;

const CustomersView: FC<IInjectedProps> = props => {
  const { values } = props;
  const [historyPageOpen, setHistoryPageOpen] = useState(false);

  return (
    <ViewContainer>
      <Descriptions 
        column={2}
        labelStyle={{ fontWeight: 500 }}>
        <Item label="Nama">{values.name}</Item>
        <Item label="Perusahaan">{values.company}</Item>
        <Item label="Status">{values.status ? 'Aktif' : 'Tidak Aktif'}</Item>
        <Item label="Email">{values.email}</Item>
        <Item label="Orang Kontak">{values.contact_person}</Item>
        <Item label="Nomor Fax">{values.fax_number}</Item>
        <Item label="Nomor Kantor">{values.office_number}</Item>
        <Item label="Nomor Kantor 2">{values.office_number_2}</Item>
        <Item label="Nomor HP">{values.phone_number}</Item>
        <Item label="Nomor HP 2">{values.phone_number_2}</Item>
        <Item label="Nomor Telepon">{values.home_number}</Item>
        <Item label="Nomor Telepon 2">{values.home_number_2}</Item>
        <Item label="Alamat">{values.address}</Item>
        <Item label="Alamat 2">{values.address_2}</Item>
        <Item label="Kota">{values.city}</Item>
        <Item label="Kota 2">{values.city_2}</Item>
        <Item label="Kode Pos">{values.zip_code}</Item>
        <Item label="Kode Pos 2">{values.zip_code_2}</Item>
        <Item label="Keterangan Ukuran">{values.measurement_details}</Item>
        <Item label="Keterangan Kirim">{values.transport_details}</Item>
        <Item label="Lain-Lain">{values.others}</Item>
      </Descriptions>
      <Table bordered
        size="small"
        pagination={false}
        dataSource={values.markings}
        columns={[{ title: 'Markings' }]} />
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
      <Button onClick={() => setHistoryPageOpen(true)}>
        Lihat Riwayat Marking
      </Button>
      <Modal centered maskClosable
        title="Riwayat Marking Customer"
        visible={historyPageOpen}
        onCancel={() => setHistoryPageOpen(false)}
        footer={null}
        width={1200}>
        <CustomerHistory id={values._id} />
      </Modal>
    </ViewContainer>
  );
}

export default CustomersView;

const ViewContainer = styled.div`
  width: calc(100% - 100px);

  > *:nth-last-child(3) {
    margin-top: 10px;
    margin-bottom: 30px;
  }

  > button:last-child {
    margin-top: 30px;
    margin-bottom: 20px;
    float: right;
  }
`;
