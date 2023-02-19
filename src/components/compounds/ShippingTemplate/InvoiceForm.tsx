import { FC, Fragment } from "react";
import { Button, message } from "antd";
import useDatabase from "../../../data/useDatabase";
import getFormInjector, { injectUser } from "../../abstractions/getFormInjector";
import { IInjectedProps } from "../../abstractions/withInitialData";
import { useCloseModal } from "../TableTemplate";
import BasicForm, { FormItem } from "../../basics/BasicForm";
import print, { Presets } from "../../../print";
import { momentsToDates } from "../../../utils";

const injectAdditionalValues = getFormInjector({
  collectionName: 'Customers',
  localField: 'marking',
  foreignField: 'markings',
  projection: { measurement_details: 1 }
});

const InvoiceForm: FC<IFormProps> = props => {
  const { items, values, printPreset } = props;
  const database = useDatabase();
  const closeModal = useCloseModal();

  const handleSubmit = (submittedValues: any) => {
    database?.collection('Invoices')
      .insertOne({ 
        marking_id: values.marking_id,
        ...momentsToDates(submittedValues)
      })
      .then(() => {
        message.success("Faktur telah disimpan.");
        closeModal();
        print(submittedValues, printPreset);
      })
      .catch(() => message.error("Error terjadi. Data gagal disimpan."));
  }

  return (
    <BasicForm twoColumns
      initialValues={values}
      onSubmit={handleSubmit}
      labelSpan={11}
      items={[injectUser, injectAdditionalValues, ...items]}
      customButton={
        <Button 
          type='primary'
          htmlType="submit">
          Print Faktur
        </Button>
      } />
  );
}

export default InvoiceForm;

interface IFormProps extends IInjectedProps {
  items: Array<FormItem>
  printPreset: Presets
}
