import { FC, useState } from "react";
import { Space, Button } from "antd";
import { FileDoneOutlined, AuditOutlined } from "@ant-design/icons";
import TableTemplate from "../../../components/compounds/TableTemplate";
import { dateToString, dateDiffInDays } from "../../../utils";
import SeaFreightView from "./View";
import SeaFreightForm from "./Form";
import TravelDocument from "./TravelDocument";
import Invoice from "./Invoice";

const SeaFreight: FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('default');

  switch (currentPage) {
    case 'travel_permits':
      return <TravelDocument />

    case 'invoices':
      return <Invoice />

    default:
      return (
        <TableTemplate
          collectionName="SeaFreight"
          searchBy="container_number"
          width={1050}
          modalWidth={850}
          showIndicator={value => true} // TODO: Indicator to signify if all the markings in the container is already paid for.
          view={SeaFreightView}
          form={SeaFreightForm}
          columns={[
            { dataIndex: "arrival_date", title: "Tanggal Tiba", width: 190, render: value => dateToString(value) },
            { dataIndex: "container_number", title: "No. Container" },
            { dataIndex: "route", title: "Rute" },
            { dataIndex: "handler", title: "Pengurus" },
            { dataIndex: "carrier", title: "Shipper" },
            { dataIndex: "container_group", title: "Kel. Container" },
            { 
              title: "Lama Tiba", 
              render: (_, values) => dateDiffInDays(values.arrival_date, values.muat_date) + ' Hari'
            }
          ]}
          extra={
            <Space>
              <Button 
                icon={<FileDoneOutlined />}
                onClick={() => setCurrentPage('travel_permits')}>
                Surat Jalan
              </Button>
              <Button 
                icon={<AuditOutlined />}
                onClick={() => setCurrentPage('invoices')}>
                Faktur
              </Button>
            </Space>
          } />
      );
  }
}

export default SeaFreight;

type PageState = 'default' | 'travel_permits' | 'invoices'
