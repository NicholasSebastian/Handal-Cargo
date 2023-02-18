import { BSON } from "realm-web";
import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Form, Input, InputNumber, Select, message } from "antd";
import useDatabase from "../../../data/useDatabase";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import InputCurrency from "../../../components/basics/InputCurrency";
import { formatCurrency } from "../../../utils";

const { Item, useForm, useWatch } = Form;
const { TextArea } = Input;
const { Option } = Select;

const InvoiceEntryForm: FC<IFormProps> = props => {
  const { values, refresh, close } = props;
  const database = useDatabase();
  const [form] = useForm();
  const [payments, setPayments] = useState<Array<any>>();

  // To keep track of changes in any of the form values.
  const price = useWatch('price', form);
  const volumeCharge = useWatch('volume_charge', form);
  const additionalFee = useWatch('additional_fee', form);
  const shipmentFee = useWatch('shipment_fee', form);
  const otherFee = useWatch('other_fee', form);
  const discount = useWatch('discount', form);

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
      discount: 0,
      payment: values.payment ? values.payment.toString() : undefined
    });

    // Fetch all the payments from the database for the Select component below.
    database?.collection('Payments')
      .aggregate([
        {
          $lookup: {
            from: 'Invoices',
            let: { id: '$_id' },
            pipeline: [
              { $project: { _id: 0, payment: 1 } },
              { $match: { $expr: { $eq: ['$payment', '$$id'] } } }
            ],
            as: 'past_invoices'
          }
        },
        { $match: { $expr: { $lt: [{ $size: '$past_invoices' }, 1] } } },
        { $project: { total: { $sum: '$items.amount' } } }
      ])
      .then(results => setPayments(results));
  }, []);

  useEffect(() => {
    // Update the total field whenever any of its dependency fields change.
    form.setFieldsValue({
      ...form.getFieldsValue(true),
      total: ((price + (volumeCharge ?? 0) + additionalFee + shipmentFee + otherFee) - discount)
    });
  }, [price, volumeCharge, additionalFee, shipmentFee, otherFee, discount]);

  const handleSubmit = (submittedValues: any) => {
    const parsedValues = { 
      ...submittedValues, 
      payment: (submittedValues.payment !== 'null') ? new BSON.ObjectId(submittedValues.payment) : null,
      currency: "IDR",
      exchange_rate: 1
    };
    
    database?.collection('Invoices')
      .updateOne({ _id: values._id }, { $set: parsedValues })
      .then(() => {
        message.success("Data telah diubah");
        close();
        refresh();
      })
      .catch(() => message.error("Error terjadi. Data gagal diubah."));
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
            <Option key={null}>
              Belum Dibayar
            </Option>
            {payments?.map(payment => {
              const id = payment._id.toString();
              return (
                <Option key={id}>
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
    margin-top: 10px;
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
