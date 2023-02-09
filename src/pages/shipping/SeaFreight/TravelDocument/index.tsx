import { FC } from "react";
import { Button, Space } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import TableTemplate from "../../../../components/compounds/ViewTableTemplate";
import { IPageProps } from "../index";
import print from "../../../../print";
import { dateToString } from "../../../../utils";

const TravelDocument: FC<IPageProps> = props => {
  const { goBack } = props;

  return (
    <TableTemplate 
      title="Surat Jalan Sea Freight"
      collection='TravelPermits'
      columns={[
        { dataIndex: 'marking', title: 'Marking' },
        { dataIndex: 'container_number', title: 'Nomor Container' },
        { dataIndex: 'carrier', title: 'Shipper' },
        { dataIndex: 'quantity', title: 'Kuantitas Kirim' }
      ]}
      viewItems={[
        { key: 'marking', label: 'Marking' },
        { key: 'date', label: 'Tanggal', render: value => dateToString(value) },
        { key: 'container_number', label: 'Nomor Container' },
        { key: 'route', label: 'Rute' },
        { key: 'quantity', label: 'Kuantitas Kirim' },
        { key: 'carrier', label: 'Shipper' },
        { key: 'measurement_option', label: 'Pilihan Ukuran' },
        { key: 'expedition', label: 'Expedisi' },
        { key: 'measurement', label: 'Ukuran' },
        { key: 'home_number', label: 'Nomor Telepon' },
        { key: 'unit', label: 'Satuan' },
        { key: 'phone_number', label: 'Nomor HP' },
        { key: 'customer', label: 'Customer' }, 
        { key: 'city', label: 'Kota' },
        { key: 'address', label: 'Alamat' },
        { key: 'description', label: 'Keterangan Kirim' }
      ]}
      viewExtra={values => (
        <Space>
          <Button onClick={() => print(values, 'sf-surat-jalan')}>
            Print Ulang Surat Jalan
          </Button>
          <Button onClick={() => print(values, 'sf-surat-jalan-daerah')}>
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
