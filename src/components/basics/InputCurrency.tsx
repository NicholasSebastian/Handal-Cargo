import { FC } from "react";
import { Form, InputNumber } from "antd";
import { formatCurrency } from "../../utils";

const { useFormInstance } = Form;

const InputCurrency: FC<IInputProps> = props => {
  const { placeholder, value, onChange } = props;
  const form = useFormInstance();
  return (
    <InputNumber 
      prefix="Rp." // TODO: Check the form for a 'currency' value. The prefix should depend on that.
      style={{ width: '100%' }} 
      formatter={value => formatCurrency(value!.toString())}
      parser={value => value!.replace(/,*/g, '')}
      placeholder={placeholder}
      value={value}
      onChange={onChange} />
  );
}

export default InputCurrency;

interface IInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}
