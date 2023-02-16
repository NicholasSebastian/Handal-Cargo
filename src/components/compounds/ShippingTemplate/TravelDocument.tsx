import { FC } from "react";
import { Button, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import { LeftOutlined } from "@ant-design/icons";
import useDatabase from "../../../data/useDatabase";
import { IViewItem } from "../../basics/BasicView";
import TableTemplate from "../ViewTableTemplate";
import { IPageProps } from "./Table";
import print, { Presets } from "../../../print";

const TravelDocument: FC<ITableProps> = props => {
  const { title, columns, viewItems, filter, printPreset, printDaerahPreset, goBack } = props;
  const database = useDatabase();
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
      viewItems={viewItems}
      viewExtra={values => (
        <Space style={{ marginTop: '-30px', marginBottom: '10px' }}>
          <Button onClick={() => print(values, printPreset)}>
            Print Ulang Surat Jalan
          </Button>
          <Button onClick={() => print(values, printDaerahPreset)}>
            Print Ulang Surat Jalan Daerah
          </Button>
        </Space>
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

export default TravelDocument;

interface ITableProps extends IPageProps {
  title: string
  columns: ColumnsType<any>
  viewItems: Array<IViewItem>
  filter: Record<string, { $exists: true }>
  printPreset: Presets
  printDaerahPreset: Presets
}
