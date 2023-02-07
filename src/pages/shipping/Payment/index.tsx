import { FC } from "react";
import useDatabase from "../../../data/useDatabase";
import TableTemplate from "../../../components/compounds/TableTemplate";
import { formatCurrency } from "../../../utils";
import PaymentForm from "./Form";
import PaymentView from "./View";

const Payment: FC = () => {
  const database = useDatabase();
  return (
    <TableTemplate
      collectionName="Payments"
      searchBy="_id"
      modalWidth={720}
      view={PaymentView}
      form={PaymentForm}
      query={(collectionName, search, searchBy) => {
        if (!search) {
          return database?.collection(collectionName).aggregate([
            { $project: { total: { $sum: "$items.amount" } } }
          ]);
        }
        else {
          switch (searchBy) {
            case '_id':
              return database?.collection(collectionName).aggregate([
                { $addFields: { id: { $toString: '$_id' } } },
                { $match: { id: { $regex: search } } },
                { $project: { total: { $sum: "$items.amount" } } }
              ]);
            case 'total':
              return database?.collection(collectionName).aggregate([
                { $project: { total: { $toString: { $sum: "$items.amount" } } } },
                { $match: { total: { $regex: search } } }
              ]);
          }
        }
      }}
      columns={[
        { 
          dataIndex: "_id", 
          title: "Kode Pembayaran", 
          render: id => id.toString() 
        },
        { 
          dataIndex: "total",
          title: "Total Pembayaran",
          render: total => 'Rp.' + formatCurrency(total)
        }
      ]} />
  );
}

export default Payment;
