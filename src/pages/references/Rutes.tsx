import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const Routes: FC = () => {
  return (
    <ListTemplate 
      collectionName="Routes"
      searchBy="name"
      form={[
        { key: 'name', label: 'Nama Rute' }
      ]} />
  );
}

export default Routes;
