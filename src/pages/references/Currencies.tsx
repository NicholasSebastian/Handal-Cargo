import { FC } from "react";
import ListTemplate from "../../components/ListTemplate";

const Currencies: FC = () => {
  return (
    <ListTemplate 
      collectionName="Currencies"
      nameLabel="Mata Uang"
      form={[{
        key: 'symbol',
        label: "Symbol"
      }]}
      itemSubtext={entry => entry.symbol} />
  );
}

export default Currencies;
