import { FC, Fragment } from "react";
import TableTemplate from "../../../components/compounds/ViewTableTemplate";
import { dateToString } from "../../../utils";

const InvoiceEntry: FC = () => {
  return (
    <TableTemplate 
      collectionName="Invoices"
      width={1500}
      modalWidth={700}
      query={(collectionName, search, searchBy) => {
        // TODO: Aggregate and use $lookup to retrive the corresponding 'SeaFreight' or 'AirCargo' data.
        return undefined;
      }}
      columns={[
        { dataIndex: "arrival_date", title: "Tanggal Tiba", render: value => dateToString(value) },
        { dataIndex: "muat_date", title: "Tanggal Muat", render: value => dateToString(value) },
        { dataIndex: "_id", title: "Kode Faktur", render: value => value?.toString() },
        { dataIndex: "payment_id", title: "Kode Pembayaran", render: value => value?.toString() },
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
        { key: "arrival_date", label: "Tanggal Tiba", render: value => dateToString(value) },
        { key: "muat_date", label: "Tanggal Muat", render: value => dateToString(value) },
        { key: "_id", label: "Kode Faktur", render: value => value?.toString() },
        { key: "payment_id", label: "Kode Pembayaran", render: value => value?.toString() },
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
      ]}
      extra={
        // TODO: Add an input and a button to set the 'payment_id' field.
        <Fragment />
      } />
  );
}

export default InvoiceEntry;
