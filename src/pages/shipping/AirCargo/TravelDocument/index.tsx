import { FC } from "react";
import Page from "../../../../components/specialized/ShippingTemplate/TravelDocument";
import { IPageProps } from "../../../../components/specialized/ShippingTemplate/Table";
import { dateToString } from "../../../../utils";

const TravelDocument: FC<IPageProps> = props => (
  <Page
    {...props}
    title="Surat Jalan Air Cargo"
    printPreset="ac-surat-jalan"
    printDaerahPreset="ac-surat-jalan-daerah"
    columns={[
      // TODO
    ]}
    viewItems={[
      // TODO
    ]} />
);

export default TravelDocument;
