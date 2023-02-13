import { FC, Fragment, useEffect, useMemo } from "react";
import { Form } from "antd";
import useDatabase from "../../data/useDatabase";
import { useUser } from "../../data/useDatabase";

const { useFormInstance } = Form;

const DataSetter: FC = () => {
  const database = useDatabase();
  const user = useUser();
  const form = useFormInstance();
  const marking = useMemo(() => form.getFieldValue('marking'), []);

  useEffect(() => {
    // Sets the 'user' field.
    const username = user?.profile.name;
    form.setFieldsValue({ ...form.getFieldsValue(true), user: username });

    // Fetches and sets the 'measurement_details' field.
    database?.collection('Customers')
      .aggregate([
        { $match: { markings: marking } },
        { $project: { _id: 0, measurement_details: 1 } }
      ])
      .then(result => {
        if (result && result.length > 0) {
          form.setFieldsValue({ ...form.getFieldsValue(true), ...result[0] });
        }
      });
  }, []);

  return <Fragment />
}

export default DataSetter;
