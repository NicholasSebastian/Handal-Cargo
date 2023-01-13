import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const Expeditions: FC = () => {
  return (
    <ListTemplate 
      collectionName="Expeditions"
      form={{ nameLabel: "Nama Expedisi" }} />
  );
}

export default Expeditions;
