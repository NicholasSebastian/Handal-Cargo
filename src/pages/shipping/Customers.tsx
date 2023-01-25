import { FC } from "react";
import styled from "styled-components";
import {} from "antd";
import TableTemplate from "../../components/compounds/TableTemplate";

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
        { key: 'transport_details', label: 'Keterangan Kirim' },
        { key: 'others', label: 'Lain-Lain' },
        { type: 'divider' },
        { type: 'custom', render: () => (
          <div>test component</div>
        )},
        'pagebreak',
        { type: 'custom', render: () => (
          <div>test component</div>
        )}
      ]} />
  );
}

export default Customers;

const ViewContainer = styled.div`
  // TODO
`;
