import { FC } from "react";
import TableTemplate from "../../components/compounds/TableTemplate";

const Payment: FC = () => {
  return (
    <TableTemplate // TODO
      collectionName="Payments"
      searchBy="name"
      columns={[
        { dataIndex: "", title: "" }
      ]}
      view={[
        { key: "", label: "" }
      ]}
      form={[
        { key: "", label: "" }
      ]} />
  );
}

export default Payment;
