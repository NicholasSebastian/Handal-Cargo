import { FC, ComponentType, useState } from "react";
import { Spin } from "antd";
import { BSON } from "realm-web";
import { useBasicDataFetching, BasicQuery } from "./useDataFetching";
import { Subtract } from "../../utils";

// Abstracts over the components to handle either 'Add' or 'Edit' cases.

function withFormHandling<P extends IInjectedProps>(FormComponent: ComponentType<P>, customQuery?: BasicQuery): 
  FC<IEnhancedProps & Subtract<P, IInjectedProps>> {
  return props => {
    const { collectionName, id, handleAdd, handleEdit, ...otherProps } = props;
    const [values, setValues] = useState<any>();
    useBasicDataFetching(collectionName, id, setValues, customQuery);

    // If an id is given, it is therefore an 'edit' form.
    if (id) {
      // Wait for the initial values to finish being loaded before rendering.
      if (values) return (
        <FormComponent 
          {...otherProps as unknown as P}
          initialValues={values} 
          onSubmit={values => handleEdit(id, values)} />
      );
      return <Spin />
    }
    // If an id is not given, it is therefore just an empty 'add' form.
    return (
      <FormComponent 
        {...otherProps as unknown as P}
        onSubmit={handleAdd} />
    );
  }
}

export type { IEnhancedProps, IInjectedProps };
export default withFormHandling;

interface IEnhancedProps {
  collectionName: string
  handleAdd: (values: any) => void
  handleEdit: (id: BSON.ObjectId, values: any) => void
  id?: BSON.ObjectId
}

interface IInjectedProps {
  initialValues?: Record<string, any>
  onSubmit: (values: any) => void
}
