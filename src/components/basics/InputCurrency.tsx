import { FC } from "react";
import { InputNumber } from "antd";
import { formatCurrency } from "../../utils";
import { DEFAULT_SYMBOL } from "../abstractions/useCurrencyHandling";

const InputCurrency: FC<IInputProps> = props => {
  const { placeholder, value, onChange, prefix } = props;
  return (
    <InputNumber 
      prefix={prefix ?? DEFAULT_SYMBOL}
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
  prefix?: string
}