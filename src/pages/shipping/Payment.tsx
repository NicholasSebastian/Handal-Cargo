import { FC } from "react";
import TableTemplate from "../../components/compounds/TableTemplate";

const Payment: FC = () => {
  return (
    <TableTemplate // TODO: Refer to page 39 on the design document.
      collectionName="Payments"
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
