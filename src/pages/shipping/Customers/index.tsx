import { FC } from "react";
import TableTemplate from "../../../components/compounds/TableTemplate";
import useDatabase from "../../../data/useDatabase";
import CustomersView from "./View";
import MarkingTable from "./MarkingTable";
import DetailsTable from "./DetailsTable";

const Customers: FC = () => {
  const database = useDatabase();
  return (
    <TableTemplate 
      collectionName="Customers"
      query={(collectionName, search, searchBy) => {
        if (search) {
          return database?.collection(collectionName).aggregate([
            { $unwind: { path: "$markings", preserveNullAndEmptyArrays: true }},
            { $match: { [searchBy]: { $regex: search }}}
          ]);
        }
        else {
          return database?.collection(collectionName).aggregate([
            { $unwind: { path: "$markings", preserveNullAndEmptyArrays: true }}
          ]);
        }
      }}
      columns={[
        { dataIndex: "name", title: "Customer" },
        { dataIndex: "markings", title: "Marking" },
        { dataIndex: "company", title: "Perusahaan" },
        { dataIndex: "office_number", title: "Nomor Kantor" },
        { dataIndex: "phone_number", title: "Nomor HP" },
        { dataIndex: "email", title: "Email" },
        { dataIndex: "status", title: "Status" }
      ]}
      view={CustomersView}
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
      ]} />
  );
}

export default Customers;
