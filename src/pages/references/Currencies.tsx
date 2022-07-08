import { FC } from "react";
import ListTemplate from "../../components/ListTemplate";

const Currencies: FC = () => {
  return (
    <ListTemplate 
      collectionName="Currencies"
      nameLabel="Mata Uang"
      extra={{
        key: 'symbol',
        label: "Symbol"
      }} />
  );
}

export default Currencies;
