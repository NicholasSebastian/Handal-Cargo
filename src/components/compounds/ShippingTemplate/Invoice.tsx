import { BSON } from "realm-web";
import { FC, useState, useEffect, useRef } from "react";
import { Button, Popconfirm, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import useDatabase from "../../../data/useDatabase";
import { IViewItem } from "../../basics/BasicView";
import TableTemplate from "../ViewTableTemplate";
import print, { Presets } from "../../../print";
import { formatCurrency } from "../../../utils";

const Invoice: FC<ITableProps> = props => {
  const { title, columns, viewItems, filter, printPreset } = props;
  const database = useDatabase();
  const [currencySymbols, setCurrencySymbols] = useState<Record<string, string>>();
  const singletons = useRef(database?.collection('Singletons'));

  useEffect(() => {
    database?.collection('Currencies')
      .find({}, { projection: { _id: 0 }})
      .then(currencies => {
        const reference = Object.fromEntries(currencies?.map(currency => [currency.name, currency.symbol]));
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

  const handleDelete = (e: React.MouseEvent | undefined, id: BSON.ObjectId, refreshData: () => void) => {
    e?.stopPropagation(); 
    database?.collection('Invoices')
      .deleteOne({ _id: id })
      .then(() => {
        message.success("Data telah dihapus.");
        refreshData();
      })
      .catch(() => message.error("Error terjadi. Data gagal dihapus."));
  }

  return (
    <TableTemplate
      title={title}
      collectionName='Invoices'
      excludeFromSearch={['quantity', 'price']}
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
      columnExtra={(entry, refreshData) => (
        <Popconfirm 
          title="Yakin di hapus?" 
          placement="left"
          onCancel={e => e?.stopPropagation()}
          onConfirm={e => handleDelete(e, entry._id, refreshData)}>
          <Button onClick={e => e.stopPropagation()}>Hapus</Button>
        </Popconfirm>
      )}
      viewItems={viewItems(currencyFormatter)}
      viewExtra={values => (
        <Button 
          onClick={() => print(values, printPreset, singletons.current)} 
          style={{ marginTop: '-10px', marginBottom: '10px' }}>
          Print Ulang Faktur
        </Button>
      )} />
  );
}

export type { CurrencyFormatter };
export default Invoice;

interface ITableProps {
  title: string
  columns: (currencyFmt: CurrencyFormatter) => ColumnsType<any>
  viewItems: (currencyFmt: CurrencyFormatter) => Array<IViewItem>
  filter: Record<string, { $exists: true }>
  printPreset: Presets
}

type CurrencyFormatter = (price: string | number, currency: string) => string;
