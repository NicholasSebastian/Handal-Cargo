import { FC } from "react";
import TableTemplate from "../../components/compounds/TableTemplate";

const InvoiceEntry: FC = () => {
  return (
    <TableTemplate // TODO
      collectionName="Invoices"
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

export default InvoiceEntry;
