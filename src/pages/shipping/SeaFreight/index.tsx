import { FC } from "react";
import TableTemplate from "../../../components/compounds/TableTemplate";
import { dateToString, dateDiffInDays } from "../../../utils";
import SeaFreightView from "./View";
import SeaFreightForm from "./Form";

const SeaFreight: FC = () => {
  return (
    <TableTemplate
      collectionName="SeaFreight"
      defaultSearchBy="container_number"
      width={1050}
      modalWidth={720}
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
      ]} />
  );
}

export default SeaFreight;
