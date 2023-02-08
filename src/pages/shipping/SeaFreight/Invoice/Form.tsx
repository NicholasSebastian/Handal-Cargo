import { FC } from "react";
import { Form, InputNumber, Button, message } from "antd";
import moment from "moment";
import useDatabase from "../../../../data/useDatabase";
import BasicForm, { ICustomComponentProps } from "../../../../components/basics/BasicForm";
import { useCloseModal } from "../../../../components/compounds/TableTemplate";
import { momentsToDates } from "../../../../utils";
import { IFormProps } from "../View";

// TODO: The Faktur print preview page should be an editable form with all the values pre-filled and
//       includes additional fields such as:
//       - Total (Uneditable field, calculated by M3/kg * Harga)
// TODO: Autosaves to the 'Invoices' collection.
// TODO: 'Print' button.

const InvoiceForm: FC<IFormProps> = props => {
  const { values, setCurrentPage } = props;
  const database = useDatabase();
  const closeModal = useCloseModal();

  return (
    <div>
      <h3>Invoice</h3>
      <pre>{JSON.stringify(values, undefined, 2)}</pre>
    </div>
  );
}

export default InvoiceForm;
