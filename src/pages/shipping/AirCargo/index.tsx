import { FC } from "react";
import ShippingTemplate from "../../../components/compounds/ShippingTemplate";
import viewAndFormStuff from "./ViewAndForm";
import markingsStuff from "./Markings";
import travelDocumentsStuff from "./TravelDocument";
import invoicesStuff from "./Invoice";
import { dateToString } from "../../../utils";

const AirCargo: FC = () => {
  return (
    <ShippingTemplate
      collectionName="AirCargo"
      searchBy="airwaybill_number"
      queryPipeline={[addTotalFields]}
      columns={[
        { dataIndex: "arrival_date", title: "Tanggal Tiba", width: 190, render: value => dateToString(value) },
        { dataIndex: "airwaybill_number", title: "No. Air Waybill" },
        { dataIndex: "item_code", title: "Kode Barang" },
        { dataIndex: "route", title: "Rute" },
        { dataIndex: "plane", title: "Pesawat" },
        { dataIndex: "total_quantity", title: "Total Muatan" },
        { dataIndex: "total_hbkg", title: "Total Berat HB", render: value => value + ' kg' }
      ]}
      {...viewAndFormStuff}
      {...markingsStuff}
      {...travelDocumentsStuff}
      {...invoicesStuff} />
  );
}

export default AirCargo;

const addTotalFields = {
  $addFields: {
    total_quantity: { $sum: '$markings.quantity' },
    total_hbkg: { $sum: '$markings.hbkg' }
  }
};
