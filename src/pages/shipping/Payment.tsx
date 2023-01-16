import { FC } from "react";
import TableTemplate from "../../components/compounds/TableTemplate";

const Payment: FC = () => {
  return (
    <TableTemplate // TODO
      collectionName="Payments"
      columns={[
        { dataIndex: "", title: "" }
      ]}
      view={[
        { key: "", label: "" }
      ]}
      form={{
        nameLabel: "Nama",
        items: [
          { key: "", label: "" }
        ]
      }} />
  );
}

export default Payment;
