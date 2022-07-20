import { FC } from "react";
import ListTemplate from "../../components/ListTemplate";

const ContainerGroups: FC = () => {
  return (
    <ListTemplate 
      collectionName="ContainerGroups"
      form={{ nameLabel: "Nama Kelompok" }} />
  );
}

export default ContainerGroups;
