import { FC } from "react";
import ListTemplate from "../../components/ListTemplate";

const Carriers: FC = () => {
  return (
    <ListTemplate 
      collectionName="Carriers"
      nameLabel="Nama Kurir" />
  );
}

export default Carriers;
