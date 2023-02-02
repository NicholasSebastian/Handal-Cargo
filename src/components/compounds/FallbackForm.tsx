import { FC, ComponentType, useId } from 'react';
import withFormHandling, { IEnhancedProps, IInjectedProps } from '../abstractions/withFormHandling';
import BasicForm, { FormItem } from '../basics/BasicForm';

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
      <FormComponent {...formProps} />
    );
  }
  // Render a BasicForm component if the given form prop is undefined or an array of items.
  else {
    const FormComponent = withFormHandling(BasicForm);
    return (
      <FormComponent {...formProps} formItems={form} />
    );
  }
}

export type { FormPropType };
export default FallbackForm;

interface IFormProps extends IEnhancedProps {
  form: FormPropType;
}

type FormComponentType = ComponentType<IInjectedProps>;
type FormPropType = FormComponentType | Array<FormItem>;
