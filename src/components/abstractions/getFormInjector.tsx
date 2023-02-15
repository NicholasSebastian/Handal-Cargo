import { Fragment, useEffect, useMemo } from "react";
import { Form } from "antd";
import useDatabase, { useUser } from "../../data/useDatabase";
import { RenderItem } from "../basics/BasicForm";

const { useFormInstance } = Form;

// Intended for use for building BasicForm custom components.
// Injects additional values into the form.

const injectUser: RenderItem = {
  type: 'custom',
  render: () => {
    const user = useUser();
    const form = useFormInstance();

    // Sets the 'user' field into the current form context.
    useEffect(() => {
      const username = user?.profile.name;
      form.setFieldsValue({ ...form.getFieldsValue(true), user: username });
    }, []);

    return <Fragment />
  }
};

function getFormInjector(config: IFormInjectorConfig): RenderItem {
  const { collectionName, localField, foreignField, projection } = config;
  return {
    type: 'custom',
    render: () => {
      const database = useDatabase();
      const form = useFormInstance();
      const localValue = useMemo(() => form.getFieldValue(localField), []);
  
      // Fetches and sets the specified fields into the current form context.
      useEffect(() => {
        database?.collection(collectionName)
          .aggregate([
            { $match: { [foreignField]: localValue } },
            { $project: { _id: 0, ...projection } }
          ])
          .then(result => {
            if (result && result.length > 0) {
              form.setFieldsValue({ ...form.getFieldsValue(true), ...result[0] });
            }
          });
      }, []);
  
      return <Fragment />
    }
  }
}

export { injectUser }
export default getFormInjector;

interface IFormInjectorConfig {
  collectionName: string
  localField: string
  foreignField: string
  projection: Record<string, any>
}
