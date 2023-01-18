import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const Carriers: FC = () => {
  return (
    <ListTemplate 
      collectionName="Carriers"
      searchBy="name"
      form={[
        { key: 'name', label: 'Nama Kurir' }
      ]} />
  );
}

export default Carriers;
