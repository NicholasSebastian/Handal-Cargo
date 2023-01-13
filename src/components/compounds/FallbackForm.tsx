import { FC, ComponentType, useId } from 'react';
import withFormHandling, { IEnhancedProps, IInjectedProps } from '../abstracts/withFormHandling';
import BasicForm, { IFormItem } from '../basics/BasicForm';

const isComponent = (component: any): component is FormComponentType => typeof component === 'function';

const FallbackForm: FC<IFormProps> = props => {
  const { form, id, collectionName, handleAdd, handleEdit } = props;

  const formProps = { 
    key: id ? id.toString() : useId(), // Will only reuse forms for the same items. 
    id,
    collectionName, 
    handleAdd, 
    handleEdit
  };

  // Render the given form component if given a component.
  if (isComponent(form)) {
    const FormComponent = withFormHandling(form);
    return (
      <FormComponent {...formProps as any} />
    );
  }
  // Render a BasicForm component if the given form prop is undefined or an array of items.
  else {
    const FormComponent = withFormHandling(BasicForm);
    const { nameLabel, items } = form;
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
