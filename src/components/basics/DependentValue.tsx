import { FC, useState, useEffect } from "react";
import { Form, Input } from "antd";
import { ICustomComponentProps } from "./BasicForm";

const { useFormInstance, useWatch, Item } = Form;

// Intended for use for building BasicForm custom components.
// Creates a disabled form item to display a calculated value dependent on other items in the form.

function createDependentValue(config: IDependentValueConfig): FC<ICustomComponentProps> {
  const { label, dependencies, calculateValue, defaultValue, labelSpan, ...args } = config;
  return () => {
    const form = useFormInstance();
    const [value, setValue] = useState(defaultValue);

    // Watch the fields defined by the given dependencies for any changes.
    const values = dependencies.map(dependency => useWatch(dependency, form));

    // Whenever the dependency values change, recalculate the value.
    useEffect(() => {
      const valuesExist = values.every(value => value != null);
      if (valuesExist) {
        setValue(calculateValue(values) || defaultValue);
      }
      else {
        setValue(defaultValue);
      }
    }, values);

    return (
      <Item 
        label={label} 
        labelCol={(labelSpan != null) ? { span: labelSpan } : undefined}>
        <Input disabled value={value} {...args} />
      </Item>
    );
  }
}

export default createDependentValue;

interface IDependentValueConfig {
  label: string
  dependencies: Array<string>
  calculateValue: (values: Array<any>) => string | number
  defaultValue: string | number
  labelSpan?: number
  [key: string]: any
}
