import { FC, useState, useEffect, useMemo, ComponentType } from "react";
import styled from "styled-components";
import { Typography, Form, Input, InputNumber, Select, Switch, Button, DatePicker, Steps, Divider } from "antd";
import { IInjectedProps } from "../abstracts/withFormHandling";
import useReferenceHandling, { getSelectItems } from "../abstracts/useReferenceHandling";
import useCurrencyHandling from "../abstracts/useCurrencyHandling";
import InputCurrency from "./InputCurrency";
import { datesToMoments } from "../../utils";

const { Title } = Typography;
const { Item, useForm } = Form;
const { Password, TextArea } = Input;
const { Option } = Select;
const { Step } = Steps;

// Creates a basic, minimally stylized form out of the given props.

const BasicForm: FC<IFormProps> = (props) => {
  const [form] = useForm();
  const { formItems, initialValues, onSubmit } = props;
  const [currentPage, setCurrentPage] = useState(0);
  const [fields, setFields] = useState<FieldsData>();
  const referenceValues = useReferenceHandling(formItems);
  const currency = useCurrencyHandling(formItems, fields);

  const pages = useMemo(() => formItems.reduce((accumulator: Array<Array<RenderItem>>, item) => {
    if (item === 'pagebreak') accumulator.push([]);
    else accumulator.at(-1)?.push(item);
    return accumulator;
  }, [[]]), [formItems]);

  useEffect(() => {
    if (!initialValues) {
      formItems.forEach(item => {
        if ((typeof item === 'object') && ('defaultValue' in item)) {
          form.setFieldsValue({ [item.key]: item.defaultValue });
        }
      });
    }
  }, [formItems]);

  const renderInput = (item: DefinedItem) => {
    switch (item.type) {
      case 'number':
        return <InputNumber style={{ width: '100%' }} />
      case 'textarea':
        return <TextArea rows={4} />
      case 'boolean':
        return <Switch />
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
        return <DatePicker />
      case 'password':
        return <Password />
      case 'currency':
        return <InputCurrency prefix={currency} />
      default:
        return <Input />
    }
  };

  const renderItem = (item: RenderItem, i: number) => {
    switch (item.type) {
      case 'custom':
        if (item.key) return (
          <Item 
            key={item.key}
            name={item.key}>
            <item.render {...fields} />
          </Item>
        );
        else return (
          <item.render key={i} {...fields} />
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

  const buttons = (
    <Item>
      {(currentPage > 0) && (
        <Button 
          type="primary" 
          htmlType="button" 
          onClick={() => setCurrentPage(page => page - 1)} 
          style={{ marginRight: 10 }}>
          Kembali
        </Button>
      )}
      {(currentPage < pages.length - 1) && (
        <Button 
          type="primary" 
          htmlType="button" 
          onClick={() => setCurrentPage(page => page + 1)}>
          Berikut
        </Button>
      )}
      {(currentPage === pages.length - 1) && (
        <Button 
          type="primary" 
          htmlType="submit">
          Simpan
        </Button>
      )}
    </Item>
  );

  return (
    <Container 
      form={form}
      initialValues={datesToMoments(initialValues)} 
      onFieldsChange={(changedFields, fields) => setFields({ 
        changedFields: changedFields.map(field => (field.name as never)[0]), 
        fields: Object.fromEntries(fields.map(field => [(field.name as never)[0], field.value])) 
      })}
      onFinish={onSubmit} 
      labelCol={{ span: 7 }}>
      {(pages.length > 1) && (
        <Overhead
          size="small"
          current={currentPage}
          onChange={i => setCurrentPage(i)}>
          {pages.map((_, i) => <Step key={i} />)}
        </Overhead>
      )}
      {pages.map((page, index) => (
        <div key={index} style={{ display: (index === currentPage) ? 'block' : 'none' }}>
          {page.map((item, i) => renderItem(item, i))}
        </div>
      ))}
      {buttons}
    </Container>
  );
}

export type { FormItem, FieldsData, RenderItem, ISelectItem, ICustomComponentProps };
export default BasicForm;

const Container = styled(Form)`
  width: calc(100% - 100px);
  
  > div:last-child {
    text-align: right;
    margin-bottom: 0;
    padding-bottom: 30px;
  }
`;

const Overhead = styled(Steps)`
  padding-top: 0;
  margin-bottom: 30px;
`;

interface IFormProps extends IInjectedProps {
  formItems: Array<FormItem>
}

interface IFormItem {
  key: string
  label: string
  type?: InputType
  required?: boolean
  defaultValue?: any
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

interface ICustomComponentProps extends FieldsData {
  value?: any
}

interface FieldsData {
  fields?: Record<string, any>
  changedFields?: Array<string>
}

type InputType = 'string' | 'textarea' | 'password' | 'number' | 'currency' | 'boolean' | 'date';
type DefinedItem = IFormItem | ISelectItem;
type RenderItem = DefinedItem | IDividerItem | IHeaderItem | ICustomItem;
type FormItem = RenderItem | 'pagebreak';
