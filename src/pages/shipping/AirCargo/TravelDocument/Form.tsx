import { FC } from "react";
import moment from "moment";
import Form from "../../../../components/specialized/ShippingTemplate/TravelDocumentForm";
import { IFormProps } from "../../../../components/specialized/ShippingTemplate/View";
import InputMeasurement from "../../../../components/specialized/InputMeasurement";

const TravelDocumentForm: FC<IFormProps> = props => (
  <Form
    {...props}
    printPreset="ac-surat-jalan"
    printDaerahPreset="ac-surat-jalan-daerah"
    items={[
      // TODO
    ]} />
);

export default TravelDocumentForm;
