import { FC, Fragment } from "react";
import { Button, message } from "antd";
import useDatabase from "../../../data/useDatabase";
import { useCloseModal } from "../TableTemplate";
import BasicForm, { FormItem } from "../../basics/BasicForm";
import getFormInjector, { injectUser } from "../../abstractions/getFormInjector";
import { IFormProps as BaseFormProps } from "./View";
import print, { Presets } from "../../../print";
import { momentsToDates } from "../../../utils";

const InvoiceForm: FC<IFormProps> = props => {
  const { items, values, printPreset, setCurrentPage } = props;
  const database = useDatabase();
  const closeModal = useCloseModal();

  const injectAdditionalValues = getFormInjector({
    collectionName: 'Customers',
    localField: 'marking',
    foreignField: 'markings',
    projection: { measurement_details: 1 }
  });

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
        <Fragment>
          <Button
            htmlType="button"
            onClick={() => setCurrentPage('default')}>
            Kembali
          </Button>
          <Button 
            type='primary'
            htmlType="submit">
            Print Faktur
          </Button>
        </Fragment>
      } />
  );
}

export default InvoiceForm;

interface IFormProps extends BaseFormProps {
  items: Array<FormItem>
  printPreset: Presets
}
