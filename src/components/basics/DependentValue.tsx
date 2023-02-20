import { FC, useMemo } from "react";
import { Form, Input } from "antd";
import { ICustomComponentProps } from "./BasicForm";

const { useFormInstance, useWatch, Item } = Form;

// Intended for use for building BasicForm custom components.
// Creates a disabled form item to display a calculated value dependent on other items in the form.

function createDependentValue(config: IDependentValueConfig): FC<ICustomComponentProps> {
  const { label, dependencies, calculateValue, defaultValue, labelSpan, ...args } = config;
  return () => {
    const form = useFormInstance();

    // Watch the fields defined by the given dependencies for any changes.
    const values = dependencies.map(dependency => useWatch(dependency, form));

    // Whenever the dependency values change, recalculate the value.
    const value = useMemo(() => {
      const valuesExist = values.every(value => value != null);
      if (valuesExist) {
        return calculateValue(values) ?? defaultValue;
      }
      else {
        return defaultValue;
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
