import { FC } from "react";
import { Form, InputNumber } from "antd";
import { ICustomComponentProps } from "../basics/BasicForm";

const { useFormInstance, useWatch, Item } = Form;

// Intended for use in SeaFreight and AirCargo's travel documents and invoices pages.

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

export default InputMeasurement;
