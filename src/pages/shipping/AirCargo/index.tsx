import { FC } from "react";
import ShippingTemplate from "../../../components/compounds/ShippingTemplate";
import viewAndFormStuff from "./ViewAndForm";
import markingsStuff from "./Markings";
import travelDocumentsStuff from "./TravelDocument";
import invoicesStuff from "./Invoice";
import { dateToString } from "../../../utils";

const AirCargo: FC = () => (
  <ShippingTemplate
    collectionName="AirCargo"
    searchBy="airwaybill_number"
    columns={[
      { dataIndex: "arrival_date", title: "Tanggal Tiba", width: 190, render: value => dateToString(value) },
      { dataIndex: "airwaybill_number", title: "No. Air Waybill" },
      { dataIndex: "item_code", title: "Kode Barang" },
      { dataIndex: "route", title: "Rute" },
      { dataIndex: "plane", title: "Pesawat" },
      { title: "Total Muatan" }, // TODO
      { title: "Total Berat HB" } // TODO
    ]}
    {...viewAndFormStuff}
    {...markingsStuff}
    {...travelDocumentsStuff}
    {...invoicesStuff} />
);

export default AirCargo;
