import { FC, Fragment, useEffect, useMemo } from "react";
import { Form, Button, InputNumber, message } from "antd";
import moment from "moment";
import useDatabase, { useUser } from "../../../../data/useDatabase";
import BasicForm, { ICustomComponentProps } from "../../../../components/basics/BasicForm";
import { useCloseModal } from "../../../../components/compounds/TableTemplate";
import { IFormProps } from "../View";
import { InputMeasurement } from "../TravelDocument/Form";
import print from "../../../../print";
import { momentsToDates } from "../../../../utils";

const { Item, useFormInstance, useWatch } = Form;

// TODO: The Faktur print preview page should be an editable form with all the values pre-filled and
//       includes additional fields such as:
//       - Total (Uneditable field, calculated by M3/kg * Harga)
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
      labelSpan={10}
      formItems={[
        { key: 'user', label: 'User', disabled: true },
        { key: 'print_date', label: 'Tanggal Cetak', type: 'date', defaultValue: moment(), disabled: true },
        { key: 'date', label: 'Tanggal', type: 'date', defaultValue: moment() },
        { key: 'marking', label: 'Marking', disabled: true },
        { key: 'measurement_details', label: 'Keterangan Ukuran', disabled: true },
        { key: 'container_number', label: 'Nomor Container', required: true },
        { key: 'quantity', label: 'Kuantitas', type: 'number', required: true },
        { key: 'route', label: 'Rute', type: 'select', items: 'Routes' },
        { key: 'carrier', label: 'Shipper', type: 'select', items: 'Carriers' },
        { key: 'two_various', label: '2 Various', type: 'boolean' },
        { key: 'via_transfer', label: 'Via Transfer', type: 'boolean' },
        { key: 'measurement_option', label: 'Pilihan Ukuran', type: 'select', required: true, 
          items: ['List (m³)', 'List (kg)', 'DList (m³)', 'DList (kg)', 'HB (m³)', 'HB (kg)', 'Cust (m³)', 'Cust (kg)'] 
        },
        { key: 'productDetail', label: 'Keterangan Barang', type: 'select', items: 'ProductDetails' },
        { key: 'measurement', type: 'custom', render: InputMeasurement },
        { key: 'currency', label: 'Mata Uang', type: 'select', items: 'Currencies' },
        { key: 'exchange_rate', label: 'Kurs', type: 'number', defaultValue: 1 },
        { key: 'price', label: 'Harga', type: 'currency', required: true },
        // TODO
        { key: '', label: 'Biaya Tambahan' },
        { key: '', label: 'Biaya Tambahan (Rp.)', disabled: true },
        // END TODO
        { key: 'expedition', label: 'Expedisi', type: 'select',  items: 'Expeditions' },
        // TODO
        { key: '', label: 'Nomor Surat Jalan Expedisi' },
        { key: '', label: 'Ongkos Kirim' },
        { key: '', label: 'Nomor Surat Jalan' },
        // END TODO
        { key: 'total', type: 'custom', render: DisplayTotal },
        { key: 'nb', label: 'NB', type: 'textarea' },
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

const DisplayTotal: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const form = useFormInstance();
  const measurement = useWatch('measurement', form);
  const price = useWatch('price', form);

  useEffect(() => {
    const total = measurement * price;
    form.setFieldsValue({ ...form.getFieldsValue(true), total });
  }, [measurement, price]);

  return (
    <Item
      label="Total"
      labelCol={{ span: 10 }}
      style={{ marginBottom: 0 }}>
      <InputNumber disabled
        value={value}
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
