import { FC, useState, useEffect } from "react";
import { Button } from "antd";
import { ColumnsType } from "antd/lib/table";
import { LeftOutlined } from "@ant-design/icons";
import useDatabase from "../../../data/useDatabase";
import { IViewItem } from "../../basics/BasicView";
import TableTemplate from "../ViewTableTemplate";
import { IPageProps } from "./Table";
import print, { Presets } from "../../../print";
import { formatCurrency } from "../../../utils";

const Invoice: FC<ITableProps> = props => {
  const { title, columns, viewItems, filter, printPreset, goBack } = props;
  const database = useDatabase();
  const [currencySymbols, setCurrencySymbols] = useState<Record<string, string>>();

  useEffect(() => {
    database?.collection('Currencies')
      .find({}, { projection: { _id: 0 }})
      .then(currencies => {
        const reference = Object.fromEntries(currencies.map(currency => [currency.name, currency.symbol]));
        setCurrencySymbols(reference);
      });
  }, []);

  const currencyFormatter = (price: string | number, currency: string) => {
    const value = formatCurrency(price);
    if (currencySymbols) 
      return currencySymbols[currency] + value;
    else 
      return value;
  }

  return (
    <TableTemplate
      title={title}
      collectionName='Invoices'
      query={(collectionName, search, searchBy) => {
        if (!search) 
          return database?.collection(collectionName).find(filter);
        else
          return database?.collection(collectionName).find({
            ...filter,
            [searchBy]: { $regex: search } 
          });
      }}
      columns={columns(currencyFormatter)}
      viewItems={viewItems(currencyFormatter)}
      viewExtra={values => (
        <Button 
          onClick={() => print(values, printPreset)} 
          style={{ marginTop: '-40px', marginBottom: '10px' }}>
          Print Ulang Faktur
        </Button>
      )}
      extra={
        <Button 
          icon={<LeftOutlined />} 
          onClick={goBack}>
          Kembali
        </Button>
      } />
  );
}

export type { CurrencyFormatter };
export default Invoice;

interface ITableProps extends IPageProps {
  title: string
  columns: (currencyFmt: CurrencyFormatter) => ColumnsType<any>
  viewItems: (currencyFmt: CurrencyFormatter) => Array<IViewItem>
  filter: Record<string, { $exists: true }>
  printPreset: Presets
}

type CurrencyFormatter = (price: string | number, currency: string) => string;
