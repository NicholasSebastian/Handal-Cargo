import { FC } from "react";
import TableTemplate from "../../components/compounds/TableTemplate";

const InvoiceEntry: FC = () => {
  return (
    <TableTemplate // TODO: Refer to page 36 on the design document.
      collectionName="Invoices"
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

export default InvoiceEntry;
