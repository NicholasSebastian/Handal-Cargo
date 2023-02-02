import { FC, ComponentType, useState, useEffect } from 'react';
import { Spin } from 'antd';
import { BSON } from 'realm-web';
import useDatabase from "../../data/useDatabase";
import { Subtract } from '../../utils';

// Abstracts over the components to inject data from the database matching its 'id'.

function withInitialData<P extends IInjectedProps>(Component: ComponentType<P>): 
  FC<IEnhancedProps & Subtract<P, IInjectedProps>> {
  return props => {
    const { collectionName, id, ...otherProps } = props;
    const database = useDatabase();
    const [values, setValues] = useState();

    // Fetch the given id's corresponding data from the database.
    useEffect(() => {
      database?.collection(collectionName)
        .findOne({ _id: id })
        .then(results => {
          if (results) setValues(results);
        });
    }, []);
    
    // Render the component with the data injected once its ready.
    if (values) return (
      <Component 
        {...otherProps as unknown as P} 
        values={values} />
    );

    // Render a Loading Spin if the data is not ready.
    return <Spin />
  }
}

export type { IEnhancedProps, IInjectedProps };
export default withInitialData;

interface IEnhancedProps {
  collectionName: string
  id: BSON.ObjectId
}

interface IInjectedProps {
  values: Record<string, any>
}
