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
  const pageProps: IPageProps = { goBack: () => setCurrentPage('default') };

  switch (currentPage) {
    case 'travel_permits':
      return <TravelDocument {...pageProps} />

    case 'invoices':
      return <Invoice {...pageProps} />

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
          query={(collectionName, search, searchBy) => {
            // TODO: The 'paid' column should display true/false, signifying whether the marking has been paid for through Entri Faktur.
            // TODO: The 'remainder' column should display an integer, signifying the quantity that has not been sent through Surat Jalan.
            // TODO: The 'travel_documents' column should display an integer, signifying the number of surat jalan that has been made.
            // TODO: The 'invoices' column should display an integer, signifying the number of faktur (invoices) that has been made.
            return undefined;
          }}
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

export type { IPageProps };
export default SeaFreight;

interface IPageProps {
  goBack: () => void
}

type PageState = 'default' | 'travel_permits' | 'invoices'
