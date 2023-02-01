import { FC, useState, useEffect } from "react";
import { Form, Input } from "antd";
import { ICustomComponentProps } from "./BasicForm";

const { Item } = Form;

function createDependentValue(config: IDependentValueConfig): FC<ICustomComponentProps> {
  return props => {
    const { fields, changedFields } = props;
    const { label, dependencies, calculateValue, defaultValue, ...args } = config;
    const [value, setValue] = useState(defaultValue);
    useEffect(() => {
      if (dependencies.some(dep => changedFields?.includes(dep))) {
        const bothHasValue = fields && dependencies.every(dep => fields[dep]);
        setValue(bothHasValue ? calculateValue(fields) : defaultValue);
      }
    }, [changedFields]);
    return (
      <Item label={label}>
        <Input disabled value={value} {...args} />
      </Item>
    );
  }
}

export default createDependentValue;

interface IDependentValueConfig {
  label: string
  dependencies: Array<string>
  calculateValue: (fields: Record<string, any>) => string | number
  defaultValue: string | number
  [key: string]: any
}
