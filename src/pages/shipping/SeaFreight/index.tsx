import { FC } from "react";
import Shipping from "../../../components/specialized/ShippingTemplate";
import SeaFreightView from "./View";
import SeaFreightForm from "./Form";
import TravelDocument from "./TravelDocument";
import Invoice from "./Invoice";
import { dateDiffInDays, dateToString } from "../../../utils";

const SeaFreight: FC = () => (
  <Shipping
    collectionName="SeaFreight"
    searchBy="container_number"
    View={SeaFreightView}
    Form={SeaFreightForm}
    TravelDocument={TravelDocument}
    Invoice={Invoice}
    columns={[
      { dataIndex: "arrival_date", title: "Tanggal Tiba", width: 190, render: value => dateToString(value) },
      { dataIndex: "container_number", title: "No. Container" },
      { dataIndex: "route", title: "Rute" },
      { dataIndex: "handler", title: "Pengurus" },
      { dataIndex: "carrier", title: "Shipper" },
      { dataIndex: "container_group", title: "Kel. Container" },
      { title: "Lama Tiba", render: (_, values) => dateDiffInDays(values.arrival_date, values.muat_date) + ' Hari' }
    ]} />
);

export default SeaFreight;
