import { FC, useState, useEffect } from "react";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import TableTemplate from "../../compounds/ViewTableTemplate";
import { IPageProps } from "./Table";
import useDatabase from "../../../data/useDatabase";
import print, { Presets } from "../../../print";
import { formatCurrency } from "../../../utils";
import { ColumnsType } from "antd/lib/table";
import { IViewItem } from "../../basics/BasicView";

const Invoice: FC<ITableProps> = props => {
  const { title, columns, viewItems, printPreset, goBack } = props;
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
      collectionName="Invoices"
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
  printPreset: Presets
}

type CurrencyFormatter = (price: string | number, currency: string) => string;
