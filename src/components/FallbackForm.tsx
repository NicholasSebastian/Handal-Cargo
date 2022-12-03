import { FC, ComponentType, useId } from 'react';
import withFormHandling, { IEnhancedProps, IInjectedProps } from './withFormHandling';
import BasicForm, { IFormItem } from './BasicForm';

const isComponent = (component: any): component is FormComponentType => typeof component === 'function';

const FallbackForm: FC<IFormProps> = props => {
  const { form, collectionName, handleAdd, handleEdit, id } = props;

  const formProps = { 
    key: id ? id.toString() : useId(), // Will only reuse forms for the same items. 
    collectionName, 
    handleAdd, 
    handleEdit,
    id
  };

  // Render the given form component if specified.
  if (isComponent(form)) {
    const FormComponent = withFormHandling(form);
    return (
      <FormComponent {...formProps as any} />
    );
  }
  // Render a BasicForm component if the given form prop is undefined or an array of items.
  else {
    const FormComponent = withFormHandling(BasicForm);
    const { nameLabel, items } = form as IFormData;
    const item1 = { key: 'name', label: nameLabel };

    if (items) return (
      <FormComponent {...formProps} formItems={[item1, ...items]} />
    );
    else return (
      <FormComponent {...formProps} formItems={[item1]} />
    );
  }
}

export type { FormPropType };
export default FallbackForm;

interface IFormProps extends IEnhancedProps {
  form: FormPropType;
}

interface IFormData { 
  nameLabel: string
  items?: Array<IFormItem> 
}

type FormComponentType = ComponentType<IInjectedProps>;
type FormPropType = FormComponentType | IFormData;
