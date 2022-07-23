import { FC, ComponentType, useState, useEffect } from "react";
import { BSON } from "realm-web";
import { Spin } from "antd";
import useDatabase from "../data/useDatabase";
import { Subtract } from "../utils";

// Abstracts over the components to handle either 'Add' or 'Edit' cases.

function withFormHandling<P extends IInjectedProps>(FormComponent: ComponentType<P>): 
  FC<IEnhancedProps & Subtract<P, IInjectedProps>> {
  return props => {
    const { collectionName, id, handleAdd, handleEdit, ...otherProps } = props;
    const database = useDatabase();
    const [initialValues, setInitialValues] = useState<any>();

    // When the form gets instantiated, check if an id is given.
    useEffect(() => {
      if (id) {
        // If an id is given, we fetch its data from the database to be the form's initial values.
        database?.collection(collectionName)
          .findOne({ _id: id })
          .then(results => {
            if (results) setInitialValues(results);
          });
      }
    }, []);

    // If an id is given, it is therefore an 'edit' form.
    if (id) {
      // Wait for the initial values to finish being loaded before rendering.
      if (initialValues) return (
        <FormComponent 
          {...otherProps as unknown as P}
          initialValues={initialValues} 
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

export type { IInjectedProps };
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
