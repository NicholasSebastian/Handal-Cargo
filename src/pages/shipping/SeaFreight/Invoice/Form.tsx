import { FC, Fragment, useEffect, useMemo } from "react";
import { Form, Button, Input, InputNumber, message } from "antd";
import moment from "moment";
import useDatabase, { useUser } from "../../../../data/useDatabase";
import { useCloseModal } from "../../../../components/compounds/TableTemplate";
import BasicForm, { ICustomComponentProps } from "../../../../components/basics/BasicForm";
import createDependentValue from "../../../../components/basics/DependentValue";
import { IFormProps } from "../View";
import print from "../../../../print";
import { momentsToDates, formatCurrency } from "../../../../utils";

const { Item, useFormInstance, useWatch } = Form;

// TODO: Autosaves to the 'Invoices' collection.
// TODO: 'Print' button.

const InvoiceForm: FC<IFormProps> = props => {
  const { values, setCurrentPage } = props;
  const database = useDatabase();
  const closeModal = useCloseModal();

  const handleSubmit = (submittedValues: any) => {
    // TODO
    console.log(submittedValues);
  }

  return (
    <BasicForm twoColumns
      initialValues={values}
      onSubmit={handleSubmit}
      labelSpan={11}
      formItems={[
        { key: 'user', label: 'User', disabled: true },
        { key: 'print_date', label: 'Tanggal Cetak', type: 'date', defaultValue: moment(), disabled: true },
        { key: 'marking', label: 'Marking', disabled: true },
        { key: 'date', label: 'Tanggal', type: 'date', defaultValue: moment() },
        { key: 'container_number', label: 'Nomor Container', required: true },
        { key: 'measurement_details', label: 'Keterangan Ukuran', disabled: true },
        { key: 'quantity', label: 'Kuantitas', type: 'number', required: true },
        { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
        { key: 'two_various', label: '2 Various', type: 'boolean' },
        { key: 'carrier', label: 'Shipper', type: 'select', items: 'Carriers' },
        { key: 'via_transfer', label: 'Via Transfer', type: 'boolean' },
        { key: 'productDetail', label: 'Keterangan Barang', type: 'select', items: 'ProductDetails' },
        { key: 'measurement_option', label: 'Pilihan Ukuran', type: 'select', required: true, 
          items: ['List (m³)', 'List (kg)', 'DList (m³)', 'DList (kg)', 'HB (m³)', 'HB (kg)', 'Cust (m³)', 'Cust (kg)'] 
        },
        { key: 'currency', label: 'Mata Uang', type: 'select', items: 'Currencies' },
        { key: 'measurement', type: 'custom', render: InputMeasurement },
        { key: 'exchange_rate', label: 'Kurs', type: 'number', defaultValue: 1 },
        { key: 'price', label: 'Harga', type: 'currency', required: true, defaultValue: 0 },
        { key: 'additional_fee', label: 'Biaya Tambahan', type: 'currency', defaultValue: 0 },
        { key: 'expedition', label: 'Expedisi', type: 'select',  items: 'Expeditions' },
        { 
          type: 'custom', 
          render: createDependentValue({
            label: "Biaya Tambahan (Rp)",
            dependencies: ['additional_fee', 'exchange_rate'],
            calculateValue: ([additional_fee, exchange_rate]) => {
              const value = additional_fee * exchange_rate;
              return formatCurrency(value.toString());
            },
            defaultValue: 0
          })
        },
        { key: 'travel_number', label: 'No. Surat Jalan Expedisi' },
        { key: 'shipment_fee', label: 'Ongkos Kirim', type: 'currency', defaultValue: 0 },
        { key: 'nb', label: 'NB', type: 'textarea' },
        { key: 'total', type: 'custom', render: DisplayTotal },
        { type: 'custom', render: DataSetter }
      ]}
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

const InputMeasurement: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const form = useFormInstance();
  const measurementOption = useWatch('measurement_option', form);

  return (
    <Item required
      label={measurementOption ?? 'Kubikasi / Berat'} 
      labelCol={{ span: 11 }} 
      style={{ marginBottom: 0 }}>
      <InputNumber 
        value={value} // Very memory inefficient way to handle the onChange but oh well.
        onChange={measurement => form.setFieldsValue({ ...form.getFieldsValue(true), measurement })}
        style={{ width: '100%' }} />
    </Item>
  );
} 

const DisplayTotal: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const form = useFormInstance();

  const currency = useWatch('currency', form);
  const measurement = useWatch('measurement', form);
  const price = useWatch('price', form);
  const additional_fee = useWatch('additional_fee', form);
  const shipment_fee = useWatch('shipment_fee', form);

  useEffect(() => {
    const total = ((measurement ?? 0) * price) + additional_fee + shipment_fee;
    form.setFieldsValue({ ...form.getFieldsValue(true), total });
  }, [measurement, price, additional_fee, shipment_fee]);

  return (
    <Item
      label={`Total (${currency})`}
      labelCol={{ span: 11 }}
      style={{ marginBottom: 0 }}>
      <Input disabled
        value={formatCurrency((value ?? 0).toString())}
        style={{ width: '100%' }} />
    </Item>
  );
}

const DataSetter: FC = () => {
  const database = useDatabase();
  const user = useUser();
  const form = useFormInstance();
  const marking = useMemo(() => form.getFieldValue('marking'), []);

  useEffect(() => {
    // Sets the 'user' field.
    const username = user?.profile.name;
    form.setFieldsValue({ ...form.getFieldsValue(true), user: username });

    // Fetches and sets the 'measurement_details' field.
    database?.collection('Customers')
      .aggregate([
        { $match: { markings: marking } },
        { $project: { _id: 0, measurement_details: 1 } }
      ])
      .then(result => {
        if (result && result.length > 0) {
          form.setFieldsValue({ ...form.getFieldsValue(true), ...result[0] });
        }
      });
  }, []);

  return <Fragment />
}

export default InvoiceForm;
