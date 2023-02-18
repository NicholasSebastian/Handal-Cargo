import { FC, Fragment } from "react";
import { Alert } from "antd";
import ListTemplate from "../../components/compounds/ListTemplate";

const Currencies: FC = () => {
  return (
    <Fragment>
      <Alert 
        type="warning" 
        message="Tolong jangan hapus/ganti 'IDR' - 'Rp.'"
        style={{ margin: '20px' }} />
      <ListTemplate 
        collectionName="Currencies"
        searchBy="name"
        form={[
          { key: 'name', label: 'Mata Uang' },
          { key: 'symbol', label: "Symbol" }
        ]}
        secondaryColumn={entry => entry.symbol} />
    </Fragment>
  );
}

export default Currencies;
