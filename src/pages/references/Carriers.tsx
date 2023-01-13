import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const Carriers: FC = () => {
  return (
    <ListTemplate 
      collectionName="Carriers"
      form={{ nameLabel: "Nama Kurir" }} />
  );
}

export default Carriers;
