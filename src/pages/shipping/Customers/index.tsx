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
        const inMarkings = await Promise.all([inSeafreightMarkings, inAirCargoMarkings]);
        return inMarkings.every(marking => marking == null);
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
        { key: 'status', label: 'Status', type: 'boolean' },
        { type: 'divider', label: 'Kontak Utama' },
        { key: 'email', label: 'Email' },
        { key: 'office_number', label: 'Nomor Kantor' },
        { key: 'phone_number', label: 'Nomor HP' },
        { key: 'home_number', label: 'Nomor Telepon' },
        { key: 'fax_number', label: 'Nomor Fax' },
        { type: 'divider', label: 'Kontak Alternatif' },
        { key: 'office_number_2', label: 'Nomor Kantor' },
        { key: 'phone_number_2', label: 'Nomor HP' },
        { key: 'home_number_2', label: 'Nomor Telepon' },
        { key: 'contact_person', label: 'Orang Kontak' },
        'pagebreak',
        { type: 'divider', label: 'Alamat Utama' },
        { key: 'address', label: 'Alamat' },
        { key: 'city', label: 'Kota' },
        { key: 'zip_code', label: 'Kode Pos' },
        { type: 'divider', label: 'Alamat Alternatif' },
        { key: 'address_2', label: 'Alamat' },
        { key: 'city_2', label: 'Kota' },
        { key: 'zip_code_2', label: 'Kode Pos' },
        { type: 'divider', label: 'Keterangan' },
        { key: 'measurement_details', label: 'Keterangan Ukuran' },
        { key: 'transport_details', label: 'Keterangan Kirim', type: 'select', items: 'Expeditions' },
        { key: 'others', label: 'Lain-Lain', type: 'textarea' },
        'pagebreak',
        { type: 'divider', label: 'Marking' },
        { key: 'markings', type: 'custom', render: MarkingTable },
        'pagebreak',
        { type: 'divider', label: 'Keterangan Barang' },
        { key: 'details', type: 'custom', render: DetailsTable }
      ]} />
  );
}

export default Customers;
