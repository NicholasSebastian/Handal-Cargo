import { FC } from "react";
import { Button, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import { LeftOutlined } from "@ant-design/icons";
import TableTemplate from "../ViewTableTemplate";
import { IViewItem } from "../../basics/BasicView";
import { IPageProps } from "./Table";
import print, { Presets } from "../../../print";

const TravelDocument: FC<ITableProps> = props => {
  const { title, columns, viewItems, printPreset, printDaerahPreset, goBack } = props;
  return (
    <TableTemplate 
      title={title}
      collectionName='TravelPermits'
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
  printPreset: Presets
  printDaerahPreset: Presets
}
