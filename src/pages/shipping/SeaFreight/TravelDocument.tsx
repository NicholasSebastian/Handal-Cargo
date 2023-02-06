import { FC, Fragment, useEffect, useMemo, useRef } from "react";
import { Form, InputNumber, Button } from "antd";
import moment from "moment";
import useDatabase from "../../../data/useDatabase";
import BasicForm, { ICustomComponentProps } from "../../../components/basics/BasicForm";
import { IInjectedProps } from "../../../components/abstractions/withInitialData";

const { Item, useFormInstance, useWatch } = Form;

// TODO: The Surat Jalan print preview page should be an editable form with all the values pre-filled
//       and includes additional fields such as:
//       - Quantity Kirim (Will be used to calculate the 'sisa' field)
//       - M3/kg (Idk, you gotta ask Ifat for clarification)
// TODO: 'Simpan' button to save to the 'TravelDocuments' collection.
// TODO: 'Simpan dan Print' button alongside a Select component for 'Surat Jalan' or 'Surat Jalan Daerah'.

const TravelDocument: FC<IInjectedProps> = props => {
  const { values } = props;
  const alsoPrint = useRef<boolean>();

  const handleSubmit = (values: any) => {
    // TODO
    console.log(values, alsoPrint.current);

    // TODO: Deduct the sisa from the SeaFreight marking by the kuantitas kirim.
  }

  return (
    <BasicForm twoColumns
      initialValues={values}
      onSubmit={handleSubmit}
      labelSpan={10}
      formItems={[
        { key: 'marking', label: 'Marking', disabled: true },
        { key: 'tanggal', label: 'Tanggal', type: 'date', defaultValue: moment(), required: true },
        { key: 'container_number', label: 'Nomor Container', disabled: true },
        { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
        { key: 'remainder', label: 'Kuantitas Kirim', type: 'number', required: true },
        { key: 'carrier', label: 'Shipper', type: 'select', items: 'Carriers' },
        { key: 'measurement_option', label: 'Pilihan Ukuran', type: 'select', items: ['Kubikasi (m³)', 'Berat (kg)'], required: true },
        { key: 'expedition', label: 'Expedisi', type: 'select', items: 'Expeditions' },
        { key: 'measurement', type: 'custom', render: InputMeasurement },
        { key: 'home_number', label: 'Nomor Telepon' },
        { key: 'unit', label: 'Satuan', type: 'select', items: ['Colly'] },
        { key: 'phone_number', label: 'Nomor HP' },
        { key: 'customer', label: 'Customer' }, 
        { key: 'city', label: 'Kota' },
        { key: 'address', label: 'Alamat', type: 'textarea' },
        { key: 'description', label: 'Keterangan Kirim', type: 'textarea' },
        { type: 'custom', render: CustomerFetcher }
      ]}
      customButton={
        <Fragment>
          <Button 
            type='primary'
            htmlType="submit"
            onClick={() => { alsoPrint.current = false }}>
            Simpan
          </Button>
          <Button 
            type='primary'
            htmlType="submit"
            onClick={() => { alsoPrint.current = true }}>
            Simpan dan Print
          </Button>
        </Fragment>
      } />
  );
}

const InputMeasurement: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const form = useFormInstance();
  const measurementOption = useWatch('measurement_option', form);

  return (
    <Item required
      label={measurementOption ?? 'Kubikasi / Berat'} 
      labelCol={{ span: 10 }} 
      style={{ marginBottom: 0 }}>
      <InputNumber 
        value={value} // Very memory inefficient way to handle the onChange but oh well.
        onChange={measurement => form.setFieldsValue({ ...form.getFieldsValue(true), measurement })}
        style={{ width: '100%' }} />
    </Item>
  );
} 

const CustomerFetcher: FC = () => {
  const database = useDatabase();
  const form = useFormInstance();
  const marking = useMemo(() => form.getFieldValue('marking'), []);

  useEffect(() => {
    database?.collection('Customers').aggregate([
      { $match: { markings: marking } },
      { $project: { _id: 0, customer: '$name', address: 1, city: 1, home_number: 1, phone_number: 1 } }
    ])
    .then(result => {
      if (result && result.length > 0) {
        form.setFieldsValue({ ...form.getFieldsValue(true), ...result[0] });
      }
    });
  }, []);
  
  return <Fragment />
}

export default TravelDocument;
