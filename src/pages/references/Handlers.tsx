import { FC } from "react";
import ListTemplate from "../../components/ListTemplate";

const Handlers: FC = () => {
  return (
    <ListTemplate 
      collectionName="Handlers"
      form={{ nameLabel: "Nama Pengurus" }} />
  );
}

export default Handlers;
