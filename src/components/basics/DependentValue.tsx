import { FC, useState, useEffect } from "react";
import { Form, Input } from "antd";
import { ICustomComponentProps } from "./BasicForm";

const { Item } = Form;

// Intended for use for building BasicForm custom components.
// Creates a disabled form item to display a calculated value dependent on other items in the form.

function createDependentValue(config: IDependentValueConfig): FC<ICustomComponentProps> {
  return props => {
    const { fields, changedFields } = props;
    const { label, dependencies, calculateValue, defaultValue, ...args } = config;
    const [value, setValue] = useState(defaultValue);

    // Whenever the dependency values change, recalculate the value.
    useEffect(() => {
      if (dependencies.some(dep => changedFields?.includes(dep))) {
        const valuesExist = fields && dependencies.every(dep => fields[dep] !== undefined);
        setValue(valuesExist ? calculateValue(fields) : defaultValue);
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
