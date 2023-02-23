import { BSON } from "realm-web";
import { FC } from "react";
import { Button, message } from "antd";
import useDatabase from "../../../data/useDatabase";
import usePrint, { Presets } from "../../abstractions/usePrint";
import getFormInjector, { injectUser } from "../../abstractions/getFormInjector";
import { IInjectedProps } from "../../abstractions/withInitialData";
import BasicForm, { FormItem } from "../../basics/BasicForm";
import { momentsToDates } from "../../../utils";

const injectAdditionalValues = getFormInjector({
  collectionName: 'Customers',
  localField: 'marking',
  foreignField: 'markings',
  projection: { 
    customer: '$name', 
    city: 1, 
    measurement_details: 1,
    email: 1
  }
});

const InvoiceForm: FC<IFormProps> = props => {
  const { items, values, printPreset, closeModal } = props;
  const database = useDatabase();
  const print = usePrint()!;

  const handleSubmit = (submittedValues: any) => {
    const id = new BSON.ObjectId();
    database?.collection('Invoices')
      .insertOne({ 
        _id: id,
        marking_id: values.marking_id,
        ...momentsToDates(submittedValues)
      })
      .then(() => {
        message.success("Faktur telah disimpan.");
        closeModal();
        print({ _id: id, ...submittedValues }, printPreset);
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
  closeModal: () => void
  printPreset: Presets
}
