import { FC } from "react";
import ListTemplate from "../../components/ListTemplate";

const Routes: FC = () => {
  return (
    <ListTemplate 
      collectionName="Routes"
      form={{ nameLabel: "Nama Rute" }} />
  );
}

export default Routes;
