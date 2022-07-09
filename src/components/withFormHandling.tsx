import { FC, ComponentType, useState, useEffect } from "react";
import { BSON } from "realm-web";
import { Spin } from "antd";
import useDatabase from "../data/useDatabase";
import { IFormProps, IFormItem } from "./BasicForm";

// Abstracts over the BasicForm component to handle either 'Add' or 'Edit' forms.

function withFormHandling(FormComponent: ComponentType<IFormProps>): FC<IDynamicFormProps> {
  return props => {
    const { collectionName, formItems, id, handleAdd, handleEdit } = props;
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
          formItems={formItems} 
          initialValues={initialValues} 
          onSubmit={values => handleEdit(id, values)} />
      );
      return <Spin />
    }
    // If an id is not given, it is therefore just an empty 'add' form.
    return (
      <FormComponent 
        formItems={formItems} 
        onSubmit={handleAdd} />
    );
  }
}

export default withFormHandling;

interface IDynamicFormProps {
  collectionName: string
  formItems: Array<IFormItem>
  handleAdd: (values: any) => void
  handleEdit: (id: BSON.ObjectId, values: any) => void
  id?: BSON.ObjectId
}
