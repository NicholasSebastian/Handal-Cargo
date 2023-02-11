import { FC } from "react";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import TableTemplate from "../../../../components/compounds/ViewTableTemplate";
import { IPageProps } from "../index";
import print from "../../../../print";
import { dateToString } from "../../../../utils";

const Invoice: FC<IPageProps> = props => {
  const { goBack } = props;

  return (
    <TableTemplate
      title=""
      collection=""
      columns={[
        // TODO
      ]}
      viewItems={[
        // TODO
      ]}
      viewExtra={values => (
        <Button onClick={() => print(values, 'sf-faktur')}>
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

export default Invoice;
