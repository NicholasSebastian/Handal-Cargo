import { FC } from "react";
import TableTemplate from "../../../components/compounds/ViewTableTemplate";

// TODO: Add an edit form.

const InvoiceEntry: FC = () => {
  return (
    <TableTemplate 
      collectionName="Invoices"
      width={1500}
      columns={[
        { dataIndex: "arrival_date", title: "Tanggal Tiba" },
        { dataIndex: "muat_date", title: "Tanggal Muat" },
        { dataIndex: "_id", title: "Kode Faktur" },
        { dataIndex: "payment_id", title: "Kode Pembayaran" },
        { dataIndex: "container_number", title: "Nomor Container" },
        { dataIndex: "marking", title: "Marking" },
        { dataIndex: "quantity", title: "Kuantitas" },
        { dataIndex: "measurement", title: "Ukuran" },
        { dataIndex: "price", title: "Harga" },
        { dataIndex: "volume_charge", title: "Cas Volume" },
        { dataIndex: "handling_fee", title: "Biaya Ngurus" },
        { dataIndex: "shipment_fee", title: "Ongkos Kirim" },
        { dataIndex: "discount", title: "Diskon" },
        { dataIndex: "other_fee", title: "Biaya Lain-Lain" },
        { dataIndex: "total", title: "Total" }
      ]}
      viewItems={[
        { key: "arrival_date", label: "Tanggal Tiba" },
        { key: "muat_date", label: "Tanggal Muat" },
        { key: "_id", label: "Kode Faktur" },
        { key: "payment_id", label: "Kode Pembayaran" },
        { key: "container_number", label: "Nomor Container" },
        { key: "marking", label: "Marking" },
        { key: "quantity", label: "Kuantitas" },
        { key: "measurement", label: "Ukuran" },
        { key: "price", label: "Harga" },
        { key: "volume_charge", label: "Cas Volume" },
        { key: "handling_fee", label: "Biaya Ngurus" },
        { key: "shipment_fee", label: "Ongkos Kirim" },
        { key: "discount", label: "Diskon" },
        { key: "other_fee", label: "Biaya Lain-Lain" },
        { key: "total", label: "Total" },
        { key: "description", label: "Keterangan" }
      ]} />
  );
}

export default InvoiceEntry;
