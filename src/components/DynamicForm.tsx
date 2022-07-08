import { FC, useState, useEffect } from "react";
import { BSON } from "realm-web";
import { Spin } from "antd";
import useDatabase from "../data/useDatabase";
import Form, { IFormItem } from "./BasicForm";

const DynamicForm: FC<IDynamicFormProps> = (props) => {
  const { collectionName, formItems, id, handleAdd, handleEdit } = props;
  const database = useDatabase();
  const [initialValues, setInitialValues] = useState<any>();

  // When the form gets instantiated, check if an id is given.
  useEffect(() => {
    if (id) {
      // If an id is given, we fetch the its data from the database to be the form's initial values.
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
      <Form 
        formItems={formItems} 
        initialValues={initialValues} 
        onSubmit={values => handleEdit(id, values)} />
    );
    return <Spin />
  }
  // If an id is not given, it is therefore just an empty 'add' form.
  return (
    <Form 
      formItems={formItems} 
      onSubmit={handleAdd} />
  );
}

export default DynamicForm;

interface IDynamicFormProps {
  collectionName: string
  formItems: Array<IFormItem>
  handleAdd: (values: any) => void
  handleEdit: (id: BSON.ObjectId, values: any) => void
  id?: BSON.ObjectId
}
