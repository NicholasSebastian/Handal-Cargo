import { FC } from "react";
import ListTemplate from "../../components/compounds/ListTemplate";

const Currencies: FC = () => {
  return (
    <ListTemplate 
      collectionName="Currencies"
      form={{
        nameLabel: "Mata Uang",
        items: [{
          key: 'symbol',
          label: "Symbol"
        }]
      }}
      itemSubtext={entry => entry.symbol} />
  );
}

export default Currencies;
