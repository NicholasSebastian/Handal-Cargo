import { FC } from "react";
import TableTemplate from "../../components/compounds/TableTemplate";

const Payment: FC = () => {
  return (
    <TableTemplate // TODO: Refer to page 39 on the design document.
      collectionName="Payments"
      columns={[
        { dataIndex: "_id", title: "Kode Pembayaran" },
        { dataIndex: "", title: "Total Pembayaran" } // TODO: This should be calculated from the other fields.
      ]}
      view={[
        { key: "", label: "" }
      ]}
      form={() => {
        return (
          <div></div>
        );
      }} />
  );
}

export default Payment;
