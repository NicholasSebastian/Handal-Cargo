import { FC, useEffect, ComponentType, ReactNode } from "react";
import styled from "styled-components";
import { Typography, Form, Input, InputNumber, Select, Switch, DatePicker, Divider } from "antd";
import { IInjectedProps } from "../abstractions/withFormHandling";
import usePageHandling from "../abstractions/usePageHandling";
import useReferenceHandling, { getSelectItems } from "../abstractions/useReferenceHandling";
import useCurrencyHandling from "../abstractions/useCurrencyHandling";
import InputCurrency from "./InputCurrency";
import { datesToMoments } from "../../utils";

const { Title } = Typography;
const { Item, useForm } = Form;
const { Password, TextArea } = Input;
const { Option } = Select;

// Creates a functional form out of the given props.

const BasicForm: FC<IFormProps> = (props) => {
  const { items, initialValues, onSubmit, twoColumns, labelSpan, customButton } = props;
  const [form] = useForm();

  // Hooks handling delegated logic.
  const { currentPage, pages, steps, buttons } = usePageHandling(items, customButton);
  const referenceValues = useReferenceHandling(items);
  const currency = useCurrencyHandling(form, items);

  // Sets all the given default values into the form at the beginning.
  useEffect(() => {
    items.forEach(item => {
      if ((typeof item === 'object') && ('defaultValue' in item) && (!form.getFieldValue(item.key))) {
        form.setFieldsValue({ [item.key]: item.defaultValue });
      }
    });
  }, [items]);

  // Returns the respective component based on the given item type.
  const renderInput = (item: DefinedItem) => {
    switch (item.type) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} disabled={item.disabled} />
      case 'textarea':
        return <TextArea rows={4} disabled={item.disabled} />
      case 'boolean':
        return <Switch disabled={item.disabled} />
      case 'select':
        const actualItems = getSelectItems(item.items, referenceValues);
        return (
          <Select>
            {actualItems?.map((item, i) => (
              <Option key={i} value={item}>{item}</Option>
            ))}
          </Select>
        );
      case 'date': 
        return <DatePicker disabled={item.disabled} />
      case 'password':
        return <Password disabled={item.disabled} />
      case 'currency':
        return <InputCurrency prefix={currency} disabled={item.disabled} />
      default:
        return <Input disabled={item.disabled} />
    }
  };

  // Returns the respective component based on the given item type.
  const renderItem = (item: RenderItem, i: number) => {
    switch (item.type) {
      case 'custom':
        if (item.key) return (
          <Item 
            key={item.key}
            name={item.key}>
            <item.render />
          </Item>
        );
        else return (
          <item.render key={i} />
        );
      case 'divider':
        return (
          <Divider 
            key={i}
            plain={item.plain} 
            orientation={item.orientation}>
            {item.label}
          </Divider>
        );
      case 'header':
        return (
          <Title 
            key={i} 
            level={4}
            style={{ textAlign: 'center', marginBottom: '20px' }}>
            {item.label}
          </Title>
        );
      default:
        const isRequired = ('required' in item && item.required);
        return (
          <Item
            key={item.key} 
            name={item.key} 
            label={item.label} 
            rules={isRequired ? [{ required: true, message: `${item.label} harus diisi.` }] : undefined}
            valuePropName={item.type === 'boolean' ? 'checked' : 'value'}>
            {renderInput(item)}
          </Item>
        );
    }
  }

  return (
    <Container 
      form={form}
      initialValues={datesToMoments(initialValues)}
      onFinish={onSubmit} 
      labelCol={{ span: labelSpan ?? 7 }}>
      {steps}
      {pages.map((page, index) => {
        const show = (index === currentPage);
        const display = show ? (twoColumns ? 'grid' : 'block') : 'none';
        return (
          <div key={index} style={{ display, gridTemplateColumns: '1fr 1fr' }}>
            {page.map((item, i) => renderItem(item, i))}
          </div>
        );
      })}
      {buttons}
    </Container>
  );
}

export type { IFormProps, FormItem, RenderItem, ISelectItem, ICustomComponentProps };
export default BasicForm;

const Container = styled(Form)`
  width: calc(100% - 100px);
  
  > div:last-child {
    text-align: right;
    margin-bottom: 0;
    padding-bottom: 30px;
  }
`;

interface IFormProps extends IInjectedProps {
  items: Array<FormItem>
  twoColumns?: boolean
  labelSpan?: number
  customButton?: ReactNode
}

interface IFormItem {
  key: string
  label: string
  type?: InputType
  required?: boolean
  defaultValue?: any
  disabled?: boolean
}

interface ISelectItem {
  key: string
  label: string
  type: 'select'
  items?: string | Array<string> // For only 'select' types.
  required?: boolean
}

interface IDividerItem {
  type: 'divider'
  label?: string
  plain?: boolean
  orientation?: "left" | "right" | "center"
}

interface IHeaderItem {
  type: 'header'
  label: string
}

interface ICustomItem {
  key?: string
  type: 'custom'
  render: ComponentType<ICustomComponentProps> // For only 'custom' types.
}

interface ICustomComponentProps {
  value?: any
}

type InputType = 'string' | 'textarea' | 'password' | 'number' | 'currency' | 'boolean' | 'date';
type DefinedItem = IFormItem | ISelectItem;
type RenderItem = DefinedItem | IDividerItem | IHeaderItem | ICustomItem;
type FormItem = RenderItem | 'pagebreak';
