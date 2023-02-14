import { FC, useEffect, useState } from "react";
import { Form, Input } from "antd";
import { ICustomComponentProps } from "../../components/basics/BasicForm";
import useDatabase from "../../data/useDatabase";
import { formatCurrency } from "../../utils";

const { useFormInstance, useWatch, Item } = Form;

// Intended for use in SeaFreight and AirCargo's invoices pages.

const DisplayTotal: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const database = useDatabase();
  const form = useFormInstance();
  const [symbol, setSymbol] = useState();

  const currency = useWatch('currency', form);
  const measurement = useWatch('measurement', form);
  const price = useWatch('price', form);
  const additional_fee = useWatch('additional_fee', form);
  const shipment_fee = useWatch('shipment_fee', form);

  useEffect(() => {
    database?.collection('Currencies')
      .findOne({ name: currency })
      .then(result => setSymbol(result.symbol));
  }, [currency]);

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
        prefix={symbol}
        value={formatCurrency((value ?? 0).toString())}
        style={{ width: '100%' }} />
    </Item>
  );
}

export default DisplayTotal;
