import { FC } from "react";
import { IPageProps } from "./View";

// TODO: The Surat Jalan print preview page should be an editable form with all the values pre-filled
//       and includes additional fields such as:
//       - Quantity Kirim (Will be used to calculate the 'sisa' field)
//       - M3/kg (Idk, you gotta ask Ifat for clarification)
// TODO: 'Simpan' button to save to the 'TravelDocuments' collection.
// TODO: 'Simpan dan Print' button alongside a Select component for 'Surat Jalan' or 'Surat Jalan Daerah'.

const TravelDocument: FC<IPageProps> = props => {
  const { values, marking } = props;

  return (
    <div>
      <h3>Travel Document</h3>
      <pre>{JSON.stringify(values, undefined, 2)}</pre>
      <pre>{JSON.stringify(marking, undefined, 2)}</pre>
    </div>
  );
}

export default TravelDocument;
