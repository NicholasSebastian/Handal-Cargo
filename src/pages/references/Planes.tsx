import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const Planes: FC = () => {
  return (
    <ListTemplate 
      collectionName="Planes"
      form={{ nameLabel: "Nama Pesawat" }} />
  );
}

export default Planes;
