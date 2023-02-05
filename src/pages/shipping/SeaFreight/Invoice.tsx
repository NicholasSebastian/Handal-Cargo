import { FC } from "react";
import { IPageProps } from "./View";

// TODO: The Faktur print preview page should be an editable form with all the values pre-filled and
//       includes additional fields such as:
//       - Total (Uneditable field, calculated by M3/kg * Harga)
// TODO: 'Simpan' button to save to the 'Invoices' collection.
// TODO: 'Simpan dan Print' button.

const Invoice: FC<IPageProps> = props => {
  const { values, marking } = props;

  return (
    <div>
      <h3>Invoice</h3>
      <pre>{JSON.stringify(values, undefined, 2)}</pre>
      <pre>{JSON.stringify(marking, undefined, 2)}</pre>
    </div>
  );
}

export default Invoice;
