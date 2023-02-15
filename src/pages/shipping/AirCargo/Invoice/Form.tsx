import { FC } from "react";
import moment from "moment";
import { DEFAULT_SYMBOL } from "../../../../components/abstractions/useCurrencyHandling";
import Form from "../../../../components/specialized/ShippingTemplate/InvoiceForm";
import { IFormProps } from "../../../../components/specialized/ShippingTemplate/View";
import InputMeasurement from "../../../../components/specialized/InputMeasurement";
import DisplayTotal from "../../../../components/specialized/DisplayTotal";
import createDependentValue from "../../../../components/basics/DependentValue";
import { momentsToDates, formatCurrency } from "../../../../utils";

const InvoiceForm: FC<IFormProps> = props => (
  <Form
    {...props}
    printPreset="ac-faktur"
    items={[
      // TODO
    ]} />
);

export default InvoiceForm;
