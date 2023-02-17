import { FC } from "react";
import useDatabase from "../../../data/useDatabase";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import TableTemplate from "../../../components/compounds/ViewTableTemplate";
import pipeline, { manuallyReplaceRoot } from "./aggregation";
import InvoiceEntryForm from "./Form";
import { dateToString, formatCurrency } from "../../../utils";

const InvoiceEntry: FC = () => {
  const database = useDatabase();
  return (
    <TableTemplate 
      collectionName="Invoices"
      width={950}
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
        { dataIndex: "payment", title: "Kode Pembayaran", render: value => value?.toString() },
        { dataIndex: "marking", title: "Marking" },
        { dataIndex: "total", title: "Total", render: value => DEFAULT_SYMBOL + formatCurrency(value) },
        { dataIndex: "payment_amount", title: "Sudah Terbayar", render: value => DEFAULT_SYMBOL + formatCurrency(value) },
        { 
          title: "Belum Dibayar",
          render: (_, values) => {
            const unpaid = values.total - (values.payment_amount ?? 0);
            return DEFAULT_SYMBOL + formatCurrency(unpaid);
          }
        }
      ]}
      viewItems={values => [
        { key: "arrival_date", label: "Tanggal Tiba", render: value => dateToString(value) },
        { key: "muat_date", label: "Tanggal Muat", render: value => dateToString(value) },
        { key: "_id", label: "Kode Faktur", render: value => value?.toString() },
        ...((values == null) ? [] 
          // If 'container_number' is in the given values, then we'll assume its from a 'SeaFreight' entry.
          : ("container_number" in values) ? [
            { key: "container_number", label: "Nomor Container", render: (value: any) => value?.toString() }
          ] : [
          // Else we'll assume that its from an 'AirCargo' entry.
            { key: "airwaybill_number", label: "Nomor Air Waybill", render: (value: any) => value?.toString() },
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
