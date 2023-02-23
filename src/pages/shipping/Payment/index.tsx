import { FC } from "react";
import useDatabase from "../../../data/useDatabase";
import TableTemplate from "../../../components/compounds/TableTemplate";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import { commaSeparate } from "../../../utils";
import PaymentForm from "./Form";
import PaymentView from "./View";

const Payment: FC = () => {
  const database = useDatabase();
  return (
    <TableTemplate
      collectionName="Payments"
      searchBy="id"
      modalWidth={720}
      view={PaymentView}
      form={PaymentForm}
      query={(collectionName, search, searchBy) => {
        if (!search) 
          return database?.collection(collectionName).aggregate([
            { $project: { id: 1, total: { $sum: "$items.amount" } } }
          ]);
        else 
          switch (searchBy) {
            case 'id':
              return database?.collection(collectionName).aggregate([
                { $match: { id: { $regex: search } } },
                { $project: { id: 1, total: { $sum: "$items.amount" } } }
              ]);
            case 'total':
              return database?.collection(collectionName).aggregate([
                { $project: { id: 1, total: { $toString: { $sum: "$items.amount" } } } },
                { $match: { total: { $regex: search } } }
              ]);
          }
      }}
      deleteCheck={async (id) => {
        const invoices = database?.collection('Invoices');
        const payment = await invoices?.findOne({ payment: id });
        return payment == null;
      }}
      columns={[
        { 
          dataIndex: "id", 
          title: "Kode Pembayaran"
        },
        { 
          dataIndex: "total",
          title: "Total Pembayaran",
          render: total => DEFAULT_SYMBOL + commaSeparate(total)
        }
      ]} />
  );
}

export default Payment;
