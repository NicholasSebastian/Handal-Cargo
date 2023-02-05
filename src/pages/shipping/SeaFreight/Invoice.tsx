import { FC } from "react";
import { IPageProps } from "./View";

// TODO: The Faktur print preview page should be an editable form with all the values pre-filled and
//       includes additional fields such as:
//       - Total (Uneditable field, calculated by M3/kg * Harga)
// TODO: Autosaves to the 'Invoices' collection.
// TODO: 'Print' button.

const Invoice: FC<IPageProps> = props => {
  const { values } = props;

  return (
    <div>
      <h3>Invoice</h3>
      <pre>{JSON.stringify(values, undefined, 2)}</pre>
    </div>
  );
}

export default Invoice;
