import { FC } from "react";
import TableTemplate from "../../components/compounds/TableTemplate";

const Customers: FC = () => {
  return (
    <TableTemplate // TODO
      collectionName="Customers"
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

export default Customers;
