import { FC } from "react";
import Page from "../../../../components/specialized/ShippingTemplate/Invoice";
import { IPageProps } from "../../../../components/specialized/ShippingTemplate/Table";
import { dateToString } from "../../../../utils";

const Invoice: FC<IPageProps> = props => (
  <Page
    {...props}
    title="Faktur Air Cargo"
    printPreset="ac-faktur"
    columns={formatCurrency => [
      // TODO
    ]}
    viewItems={formatCurrency => [
      // TODO
    ]} />
);

export default Invoice;
