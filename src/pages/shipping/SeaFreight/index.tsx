import { FC } from "react";
import ShippingTemplate from "../../../components/compounds/ShippingTemplate";
import viewAndFormStuff from "./ViewAndForm";
import markingsStuff from "./Markings";
import travelDocumentsStuff from "./TravelDocument";
import invoicesStuff from "./Invoice";
import { dateDiffInDays, dateToString } from "../../../utils";

const SeaFreight: FC = () => (
  <ShippingTemplate
    collectionName="SeaFreight"
    searchBy="container_number"
    columns={[
      { dataIndex: "arrival_date", title: "Tanggal Tiba", width: 190, render: dateToString },
      { dataIndex: "container_number", title: "No. Container" },
      { dataIndex: "route", title: "Rute" },
      { dataIndex: "handler", title: "Pengurus" },
      { dataIndex: "carrier", title: "Shipper" },
      { dataIndex: "container_group", title: "Kel. Container" },
      { title: "Lama Tiba", render: (_, values) => dateDiffInDays(values.arrival_date, values.muat_date) + ' Hari' }
    ]}
    {...viewAndFormStuff}
    {...markingsStuff}
    {...travelDocumentsStuff}
    {...invoicesStuff} />
);

export default SeaFreight;
