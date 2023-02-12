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
        { dataIndex: '_id', title: 'Nomor Faktur' },
        { dataIndex: 'marking', title: 'Marking' },
        { dataIndex: 'container_number', title: 'Nomor Container' },
        { dataIndex: 'quantity', title: 'Kuantitas' },
        { dataIndex: 'price', title: 'Harga' }
      ]}
      viewItems={[
        { key: 'user', label: 'User' },
        { key: 'print_date', label: 'tanggal_cetak', render: value => dateToString(value) },
        { key: 'marking', label: 'Marking' },
        { key: '', label: '' }, // TODO
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' },
        { key: '', label: '' }
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
