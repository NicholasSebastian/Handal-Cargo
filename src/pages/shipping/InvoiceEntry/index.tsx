import { FC } from "react";
import TableTemplate from "../../../components/compounds/TableTemplate";

const InvoiceEntry: FC = () => {
  return (
    <TableTemplate
      collectionName="Invoices"
      searchBy=""
      query={(collectionName, search, searchBy) => {
        // TODO
        return undefined;
      }}
      columns={[
        { dataIndex: "arrival_date", title: "Tanggal Tiba" },
        { dataIndex: "muat_date", title: "Tanggal Muat" },
        { dataIndex: "_id", title: "Kode Faktur" },
        { dataIndex: "", title: "Kode Barang" },
        { dataIndex: "container_number", title: "Nomor Container" },
        { dataIndex: "marking", title: "Marking" },
        { dataIndex: "quantity", title: "Kuantitas" },
        { dataIndex: "measurement", title: "Ukuran" },
        { dataIndex: "pricee", title: "Harga" },
        { dataIndex: "volume_charge", title: "Cas Volume" },
        { dataIndex: "handling_fee", title: "Biaya Ngurus" },
        { dataIndex: "shipment_fee", title: "Ongkos Kirim" },
        { dataIndex: "discount", title: "Diskon" },
        { dataIndex: "other_fee", title: "Biaya Lain-Lain" },
        { dataIndex: "total", title: "Total" },
        { dataIndex: "description", title: "Keterangan" }
      ]}
      view={[
        { key: "", label: "" }
      ]}
      form={[
        { key: "", label: "" }
      ]} />
  );
}

export default InvoiceEntry;
