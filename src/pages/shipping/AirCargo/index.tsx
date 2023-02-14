import { FC, useState } from "react";
import { Space, Button } from "antd";
import { FileDoneOutlined, AuditOutlined } from "@ant-design/icons";
import TableTemplate from "../../../components/compounds/TableTemplate";
// import AirCargoView from "./View";
import AirCargoForm from "./Form";
// import TravelDocument from "./TravelDocument";
// import Invoice from "./Invoice";
import { markingAggregation, aggregationLookup } from "../marking-aggregation";
import useDatabase from "../../../data/useDatabase";
import { dateToString } from "../../../utils";

const AirCargo: FC = () => {
  const database = useDatabase();
  const [currentPage, setCurrentPage] = useState<PageState>('default');
  const pageProps: IPageProps = { 
    goBack: () => setCurrentPage('default') 
  };

  switch (currentPage) {
    // case 'travel_permits':
    //   return <TravelDocument {...pageProps} />

    // case 'invoices':
    //   return <Invoice {...pageProps} />

    default:
      return (
        <TableTemplate
          collectionName="AirCargo"
          searchBy="airwaybill_number"
          width={1050}
          modalWidth={850}
          itemQuery={(collectionName, id) => database?.collection(collectionName)
            .aggregate([
              { $match: { _id: id } },
              ...aggregationLookup.map(args => ({ $lookup: args })),
              { $set: { 'markings': markingAggregation } },
              { $project: Object.fromEntries(aggregationLookup.map(args => ([args.as, false]))) }
            ])
            .then(results => results[0])
          }
          showIndicator={values => values.paid}
          view={() => <div />} // TODO
          form={AirCargoForm}
          columns={[
            { dataIndex: "arrival_date", title: "Tanggal Tiba", width: 190, render: value => dateToString(value) },
            { dataIndex: "airwaybill_number", title: "No. Air Waybill" },
            { dataIndex: "item_code", title: "Kode Barang" },
            { dataIndex: "route", title: "Rute" },
            { dataIndex: "plane", title: "Pesawat" },
            { title: "Total Muatan" },
            { title: "Total Berat HB" }
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
export default AirCargo;

interface IPageProps {
  goBack: () => void
}

type PageState = 'default' | 'travel_permits' | 'invoices'
