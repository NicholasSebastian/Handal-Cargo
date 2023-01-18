import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const Currencies: FC = () => {
  return (
    <ListTemplate 
      collectionName="Currencies"
      searchBy="name"
      form={[
        { key: 'name', label: 'Mata Uang' },
        { key: 'symbol', label: "Symbol" }
      ]}
      secondaryColumn={entry => entry.symbol} />
  );
}

export default Currencies;
