import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Form, Input, InputNumber, Select } from "antd";
import useDatabase from "../../../data/useDatabase";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import InputCurrency from "../../../components/basics/InputCurrency";
import { formatCurrency } from "../../../utils";

const { Item, useForm } = Form;
const { TextArea } = Input;
const { Option } = Select;

// TODO: 'marking-aggregation.ts', implement the lunas feature.
// TODO: Customer History.
// TODO: Print formats.
// TODO: Table Pagination.

const InvoiceEntryForm: FC<IFormProps> = props => {
  const { values, refresh, close } = props;
  const database = useDatabase();
  const [form] = useForm();
  const [payments, setPayments] = useState<Array<any>>();

  useEffect(() => {
    // Set the initial values for all the fields.
    form.setFieldsValue({
      ...form.getFieldsValue(true),
      measurement: values.measurement ?? 0,
      price: values.price ? (values.price * values.exchange_rate) : 0,
      volume_charge: values.volume_charge ? (values.volume_charge * values.exchange_rate) : 0,
      additional_fee: values.additional_fee ? (values.additional_fee * values.exchange_rate) : 0,
      shipment_fee: values.shipment_fee ? (values.shipment_fee * values.exchange_rate) : 0,
      other_fee: 0,
      discount: 0
    });

    // TODO: Fetch from the Invoices document to filter out the payments of the ones that have already been used before.

    // Fetch all the payments from the database for the Select component below.
    database?.collection('Payments')
      .aggregate([{ $project: { total: { $sum: '$items.amount' }}}])
      .then(results => setPayments(results));
  }, []);

  const handleSubmit = (values: any) => {
    // TODO
    console.log(values);
  }

  return (
    <EntryForm 
      form={form} 
      initialValues={values}
      onFinish={handleSubmit}
      labelCol={{ span: 11 }}>
      <div>
        <Item
          name='measurement'
          label={values.measurement_option ?? "Kubikasi / Berat"}
          rules={[{ required: true, message: "Ini harus diisi." }]}>
          <InputNumber style={{ width: '100%' }} />
        </Item>
        <Item
          name="price" 
          label="Harga"
          rules={[{ required: true, message: "Ini harus diisi." }]}>
          <InputCurrency />
        </Item>
        {values.volume_charge ? (
          <Item
            name="volume_charge"
            label="Cas Volume"
            rules={[{ required: true, message: "Ini harus diisi." }]}>
            <InputCurrency />
          </Item>
        ) : <div />}
        <Item
          name="additional_fee"
          label="Biaya Tambahan"
          rules={[{ required: true, message: "Ini harus diisi." }]}>
          <InputCurrency />
        </Item>
        <Item
          name="shipment_fee"
          label="Ongkos Kirim"
          rules={[{ required: true, message: "Ini harus diisi." }]}>
          <InputCurrency />
        </Item>
        <Item
          name="other_fee"
          label="Biaya Lain-Lain"
          rules={[{ required: true, message: "Ini harus diisi." }]}>
          <InputCurrency />
        </Item>
        <Item
          name="discount"
          label="Diskon"
          rules={[{ required: true, message: "Ini harus diisi." }]}>
          <InputCurrency />
        </Item>
        <Item
          name="total"
          label="Total">
          <InputCurrency disabled />
        </Item>
        <div />
        <Item
          name="description"
          label="Keterangan">
          <TextArea />
        </Item>
      </div>
      <div>
        <Item 
          name="payment"
          rules={[{ required: true, message: "Pembayaran belum terpilih." }]}>
          <Select 
            placeholder="Kode Pembayaran" 
            style={{ width: '350px' }}>
            {payments?.map(payment => {
              const id = payment._id.toString();
              return (
                <Option 
                  key={id}>
                  {id} - {DEFAULT_SYMBOL}{formatCurrency(payment.total)}
                </Option>
              );
            })}
          </Select>
        </Item>
        <Item>
          <Button
            type="primary"
            htmlType="submit">
            Bayar
          </Button>
        </Item>
      </div>
    </EntryForm>
  );
}

export default InvoiceEntryForm;

const EntryForm = styled(Form)`
  margin-top: -30px;

  > div:first-child {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  > div:last-child {
    margin-top: 10px;
    margin-bottom: 0;
    display: flex;
    float: right;

    > div:last-child {
      margin-left: 10px;
    }
  }
`;

interface IFormProps {
  values: Record<string, any> 
  close: () => void
  refresh: () => void
}
