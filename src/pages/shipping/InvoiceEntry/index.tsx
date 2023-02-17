import { FC } from "react";
import TableTemplate from "../../../components/compounds/ViewTableTemplate";
import useDatabase from "../../../data/useDatabase";
import pipeline, { manuallyReplaceRoot } from "./aggregation";
import InvoiceEntryForm from "./Form";
import { dateToString } from "../../../utils";

const InvoiceEntry: FC = () => {
  const database = useDatabase();
  return (
    <TableTemplate 
      collectionName="Invoices"
      width={1500}
      modalWidth={700}
      query={(collectionName, search, searchBy) => {
        if (!search) 
          return database?.collection(collectionName)
            .aggregate(pipeline)
            .then(manuallyReplaceRoot);
        else 
          return database?.collection(collectionName)
            .aggregate([
              ...pipeline,
              { $match: { [searchBy]: { $regex: search }}}
            ])
            .then(manuallyReplaceRoot);
      }}
      columns={[
        { dataIndex: "arrival_date", title: "Tanggal Tiba", render: value => dateToString(value) },
        { dataIndex: "muat_date", title: "Tanggal Muat", render: value => dateToString(value) },
        { dataIndex: "_id", title: "Kode Faktur", render: value => value?.toString() },
        { dataIndex: "payment_id", title: "Kode Pembayaran", render: value => value?.toString() },
        { dataIndex: "marking", title: "Marking" },
        { dataIndex: "quantity", title: "Kuantitas" },
        { dataIndex: "measurement", title: "Ukuran" },
        { dataIndex: "price", title: "Harga" },
        { dataIndex: "volume_charge", title: "Cas Volume" },
        { dataIndex: "additional_fee", title: "Biaya Tambahan" },
        { dataIndex: "shipment_fee", title: "Ongkos Kirim" },
        { dataIndex: "discount", title: "Diskon" },
        { dataIndex: "other_fee", title: "Biaya Lain-Lain" },
        { dataIndex: "total", title: "Total" }
      ]}
      viewItems={values => [
        { key: "arrival_date", label: "Tanggal Tiba", render: value => dateToString(value) },
        { key: "muat_date", label: "Tanggal Muat", render: value => dateToString(value) },
        { key: "_id", label: "Kode Faktur", render: value => value?.toString() },
        ...((values == null) ? [] 
          // If 'container_number' is in the given values, then we'll assume its from a 'SeaFreight' entry.
          : ("container_number" in values) ? [
            { key: "container_number", label: "Nomor Container" }
          ] : [
          // Else we'll assume that its from an 'AirCargo' entry.
            { key: "airwaybill_number", label: "Nomor Air Waybill" },
            { key: "item_code", label: "Kode Barang" }
          ]),
        { key: "marking", label: "Marking" },
        { key: "quantity", label: "Kuantitas" }
      ]}
      viewExtra={(values, close, refreshData) => {
        if (values) return (
          <InvoiceEntryForm
            key={Date.now()}
            values={values}
            refresh={refreshData}
            close={close} />
        );
      }} />
  );
}

export default InvoiceEntry;
