import { FC } from "react";
import Shipping from "../../../components/specialized/ShippingTemplate";
import AirCargoView from "./View";
import AirCargoForm from "./Form";
import TravelDocument from "./TravelDocument";
import Invoice from "./Invoice";
import { dateToString } from "../../../utils";

const AirCargo: FC = () => (
  <Shipping
    collectionName="AirCargo"
    searchBy="airwaybill_number"
    View={AirCargoView}
    Form={AirCargoForm}
    TravelDocument={TravelDocument}
    Invoice={Invoice}
    columns={[
      { dataIndex: "arrival_date", title: "Tanggal Tiba", width: 190, render: value => dateToString(value) },
      { dataIndex: "airwaybill_number", title: "No. Air Waybill" },
      { dataIndex: "item_code", title: "Kode Barang" },
      { dataIndex: "route", title: "Rute" },
      { dataIndex: "plane", title: "Pesawat" },
      { title: "Total Muatan" }, // TODO
      { title: "Total Berat HB" } // TODO
    ]} />
);

export default AirCargo;
