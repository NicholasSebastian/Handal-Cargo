import { FC } from "react";
import styled from "styled-components";
import TableTemplate from "../../../components/compounds/TableTemplate";
import MarkingTable from "./MarkingTable";
import DetailsTable from "./DetailsTable";

const Customers: FC = () => {
  return (
    <TableTemplate 
      collectionName="Customers"
      columns={[
        { dataIndex: "name", title: "Customer" },
        // TODO: Implement override for column items;
        //       Each row in the table should be for each marking instead of each customer.
        //       Basically, this table is more of a Customer Markings table than a Customers table.
      ]}
      view={props => {
        const { values } = props;
        return (
          <ViewContainer>
            {/* TODO: Display all the fields, including the list of markings and table of details. */}
            {/* TODO: Customer History table that can be viewed optionally, to display all the past markings.
              Includes an advanced search feature by Customer or by Markings. */}
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
        { key: 'markings', type: 'custom', render: MarkingTable },
        'pagebreak',
        { key: 'details', type: 'custom', render: DetailsTable }
      ]} />
  );
}

export default Customers;

const ViewContainer = styled.div`
  // TODO
`;
