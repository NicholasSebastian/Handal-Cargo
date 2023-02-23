import { FC, Fragment, useRef } from "react";
import { Button, message } from "antd";
import useDatabase from "../../../data/useDatabase";
import usePrint, { Presets } from "../../abstractions/usePrint";
import { IInjectedProps } from "../../abstractions/withInitialData";
import getFormInjector from "../../abstractions/getFormInjector";
import BasicForm, { FormItem } from "../../basics/BasicForm";
import { momentsToDates } from "../../../utils"; 

const injectAdditionalValues = getFormInjector({
  collectionName: 'Customers',
  localField: 'marking',
  foreignField: 'markings',
  projection: { 
    customer: '$name', 
    address: 1, 
    city: 1, 
    home_number: 1, 
    phone_number: 1,
    email: 1
  }
});

const TravelDocumentForm: FC<IFormProps> = props => {
  const { items, values, printPreset, printDaerahPreset, closeModal } = props;
  const database = useDatabase();
  const print = usePrint()!;
  const isDaerahType = useRef<boolean>();

  const handleSubmit = (submittedValues: any) => {
    database?.collection('TravelPermits')
      .insertOne({ 
        marking_id: values.marking_id,
        ...momentsToDates(submittedValues)
      })
      .then(() => {
        message.success("Surat Jalan telah disimpan.");
        closeModal();

        // Proceed to the printing process.
        const preset = isDaerahType.current ? printDaerahPreset : printPreset;
        print(submittedValues, preset);
      })
      .catch(() => message.error("Error terjadi. Data gagal disimpan."));
  }

  return (
    <BasicForm twoColumns
      labelSpan={11}
      initialValues={values}
      onSubmit={handleSubmit}
      items={[injectAdditionalValues, ...items]}
      customButton={
        <Fragment>
          <Button 
            type='primary'
            htmlType="submit"
            onClick={() => { isDaerahType.current = false }}>
            Print Surat Jalan
          </Button>
          <Button 
            type='primary'
            htmlType="submit"
            onClick={() => { isDaerahType.current = true }}>
            Print Surat Jalan Daerah
          </Button>
        </Fragment>
      } />
  );
}

export default TravelDocumentForm;

interface IFormProps extends IInjectedProps {
  items: Array<FormItem>
  closeModal: () => void
  printPreset: Presets
  printDaerahPreset: Presets
}
