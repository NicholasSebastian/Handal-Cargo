import { FC } from "react";
import useDatabase from "../../../data/useDatabase";
import TableTemplate from "../../../components/compounds/TableTemplate";
import CustomersView from "./View";
import MarkingTable from "./MarkingTable";
import DetailsTable from "./DetailsTable";

const Customers: FC = () => {
  const database = useDatabase();
  return (
    <TableTemplate 
      collectionName="Customers"
      searchBy="name"
      excludeFromSearch={['status']}
      modalWidth={700}
      query={(collectionName, search, searchBy) => {
        if (!search) 
          return database?.collection(collectionName).aggregate([
            { $unwind: { path: "$markings", preserveNullAndEmptyArrays: true }}
          ]);
        else 
          return database?.collection(collectionName).aggregate([
            { $unwind: { path: "$markings", preserveNullAndEmptyArrays: true }},
            { $match: { [searchBy]: { $regex: search }}}
          ]);
      }}
      deleteCheck={async (_, entry) => {
        // Check if the marking is already being used in a SeaFreight or AirCargo entry.
        const marking = entry.markings;
        const inSeafreightMarkings = database?.collection('SeaFreight').findOne({ 'markings.marking': marking });
        const inAirCargoMarkings =  database?.collection('AirCargo').findOne({ 'markings.marking': marking });
        const markings = await Promise.all([inSeafreightMarkings, inAirCargoMarkings]);
        return markings.every(marking => marking == null);
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
        { key: 'others', label: 'Lain-Lain', type: 'textarea' },
        'pagebreak',
        { key: 'markings', type: 'custom', render: MarkingTable },
        'pagebreak',
        { key: 'details', type: 'custom', render: DetailsTable }
      ]} />
  );
}

export default Customers;
