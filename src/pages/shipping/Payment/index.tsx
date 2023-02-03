import { FC } from "react";
import TableTemplate from "../../../components/compounds/TableTemplate";
import { formatCurrency } from "../../../utils";
import PaymentForm from "./Form";
import PaymentView from "./View";

const Payment: FC = () => {
  return (
    <TableTemplate
      collectionName="Payments"
      modalWidth={700}
      view={PaymentView}
      form={PaymentForm}
      columns={[
        { 
          dataIndex: "_id", 
          title: "Kode Pembayaran", 
          render: id => id.toString() 
        },
        { 
          title: "Total Pembayaran",
          render: (_, row) => 'Rp.' + formatCurrency(row.items.reduce((acc: number, item: any) => acc + item.amount, 0))
        }
      ]} />
  );
}

export default Payment;
