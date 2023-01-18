import { FC, useState, useEffect, useMemo, ComponentType } from "react";
import styled from "styled-components";
import { Form, Input, InputNumber, Switch, Select, Button, DatePicker, Steps } from "antd";
import useDatabase from "../../data/useDatabase";
import { IInjectedProps } from "../abstracts/withFormHandling";
import { datesToMoments } from "../../utils";

const { Item } = Form;
const { Option } = Select;
const { Password } = Input;
const { Step } = Steps;

// Creates a basic, minimally stylized form out of the given props.

const isItem = (item: FormItem): item is (IFormItem | ISelectItem | ICustomItem) => item !== 'pagebreak';
const isSelect = (item: IFormItem | ISelectItem | ICustomItem): item is ISelectItem => item.type === 'select';
const isCustom = (item: IFormItem | ISelectItem | ICustomItem): item is ICustomItem => item.type === 'custom';
const requireFetch = (item: ISelectItem) => typeof item.items === 'string';

const BasicForm: FC<IFormProps> = (props) => {
  const database = useDatabase()!;
  const { formItems, initialValues, onSubmit } = props;
  const [referenceValues, setReferenceValues] = useState<Record<string, Array<string>>>();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(() => formItems.reduce((accumulator: Array<Array<IFormItem | ISelectItem | ICustomItem>>, item) => {
    if (item === 'pagebreak') accumulator.push([]);
    else accumulator.at(-1)?.push(item);
    return accumulator;
  }, [[]]), [formItems]);

  useEffect(() => {
    const referenceItems = formItems.filter(item => isItem(item) && isSelect(item) && requireFetch(item)) as Array<ISelectItem>;
    Promise.all(
      referenceItems.map(item => {
        const collectionName = item.items as string;
        return database
          .collection(collectionName)
          .find({}, { projection: { name: 1 } });
      }))
    .then(references => {
      const values = Object.fromEntries(references.map((values, i) => {
        const collectionName = referenceItems[i].items;
        return [collectionName, values.map(v => v.name)];
      }));
      setReferenceValues(values);
    });
  }, [formItems]);

  const getSelectItems = (arg: string | string[] | undefined) => {
    if (Array.isArray(arg)) 
      return arg;
    else if (typeof arg === 'string' && referenceValues) 
      return referenceValues[arg];
    else
      return undefined;
  }

  const renderInput = (item: IFormItem | ISelectItem) => {
    switch (item.type) {
      case 'number':
        return <InputNumber />
      case 'boolean':
        return <Switch />
      case 'select':
        const items = getSelectItems(item.items);
        return <Select>{items?.map((item, i) => <Option key={i} value={item}>{item}</Option>)}</Select>
      case 'date': 
        return <DatePicker />
      case 'password':
        return <Password />
      default:
        return <Input />
    }
  };

  return (
    <Container 
      initialValues={datesToMoments(initialValues)} 
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
          {page.map(item => {
            if (isCustom(item)) {
              const CustomComponent = item.render;
              if (CustomComponent !== undefined) 
                return <CustomComponent />;
            }
            else return (
              <Item
                key={item.key} 
                name={item.key} 
                label={item.label} 
                rules={item.required === false ? undefined : [{ required: true, message: `${item.label} harus diisi.` }]}
                valuePropName={item.type === 'boolean' ? 'checked' : 'value'}>
                {renderInput(item)}
              </Item>
            );
          })}
        </div>
      ))}
      <Item>
        {(currentPage > 0) && (
          <Button 
            type="primary" 
            htmlType="button" 
            onClick={() => setCurrentPage(page => page - 1)} 
            style={{ marginRight: 10 }}>
            Previous
          </Button>
        )}
        {(currentPage < pages.length - 1) && (
          <Button 
            type="primary" 
            htmlType="button" 
            onClick={() => setCurrentPage(page => page + 1)}>
            Next
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
    </Container>
  );
}

export type { FormItem };
export default BasicForm;

const Container = styled(Form)`
  width: 500px;
  
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
}

interface ISelectItem {
  key: string
  label: string
  type?: 'select'
  items?: string | Array<string> // For only 'select' types.
  required?: boolean
}

interface ICustomItem {
  type: 'custom'
  render: ComponentType // For only 'custom' types.
}

type InputType = 'string' | 'password' | 'number' | 'boolean' | 'date';
type FormItem = IFormItem | ISelectItem | ICustomItem | 'pagebreak';
