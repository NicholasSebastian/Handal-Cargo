import { FC, Fragment, useEffect, useMemo } from "react";
import { Form } from "antd";
import useDatabase from "../../data/useDatabase";

const { useFormInstance } = Form;

const CustomerFetcher: FC = () => {
  const database = useDatabase();
  const form = useFormInstance();
  const marking = useMemo(() => form.getFieldValue('marking'), []);

  useEffect(() => {
    database?.collection('Customers')
      .aggregate([
        { $match: { markings: marking } },
        { $project: { _id: 0, customer: '$name', address: 1, city: 1, home_number: 1, phone_number: 1 } }
      ])
      .then(result => {
        if (result && result.length > 0) {
          form.setFieldsValue({ ...form.getFieldsValue(true), ...result[0] });
        }
      });
  }, []);
  
  return <Fragment />
}

export default CustomerFetcher;
