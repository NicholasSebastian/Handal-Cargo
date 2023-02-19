import { BSON } from "realm-web";
import { FC } from "react";
import { Button, Popconfirm, Space, message } from "antd";
import { ColumnsType } from "antd/lib/table";
import useDatabase from "../../../data/useDatabase";
import { IViewItem } from "../../basics/BasicView";
import TableTemplate from "../ViewTableTemplate";
import print, { Presets } from "../../../print";

const TravelDocument: FC<ITableProps> = props => {
  const { title, columns, viewItems, filter, printPreset, printDaerahPreset } = props;
  const database = useDatabase();

  const handleDelete = (e: React.MouseEvent | undefined, id: BSON.ObjectId, refreshData: () => void) => {
    e?.stopPropagation(); 
    database?.collection('TravelPermits')
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
      collectionName='TravelPermits'
      query={(collectionName, search, searchBy) => {
        if (!search) 
          return database?.collection(collectionName).find(filter);
        else
          return database?.collection(collectionName).find({
            ...filter,
            [searchBy]: { $regex: search } 
          });
      }}
      columns={columns}
      columnExtra={(entry, refreshData) => (
        <Popconfirm 
          title="Yakin di hapus?" 
          placement="left"
          onCancel={e => e?.stopPropagation()}
          onConfirm={e => handleDelete(e, entry._id, refreshData)}>
          <Button onClick={e => e.stopPropagation()}>Hapus</Button>
        </Popconfirm>
      )}
      viewItems={viewItems}
      viewExtra={values => (
        <Space style={{ marginTop: '-10px', marginBottom: '10px' }}>
          <Button onClick={() => print(values, printPreset)}>
            Print Ulang Surat Jalan
          </Button>
          <Button onClick={() => print(values, printDaerahPreset)}>
            Print Ulang Surat Jalan Daerah
          </Button>
        </Space>
      )} />
  );
}

export default TravelDocument;

interface ITableProps {
  title: string
  columns: ColumnsType<any>
  viewItems: Array<IViewItem>
  filter: Record<string, { $exists: true }>
  printPreset: Presets
  printDaerahPreset: Presets
}
