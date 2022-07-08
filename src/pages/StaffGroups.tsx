import { FC } from "react";
import ListTemplate from "../components/ListTemplate";

const StaffGroups: FC = () => {
  return (
    <ListTemplate 
      collectionName="StaffGroups"
      nameLabel="Nama Grup" />
  );
}

export default StaffGroups;
