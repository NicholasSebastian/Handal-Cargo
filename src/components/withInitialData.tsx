import { FC, ComponentType, useState, useEffect } from 'react';
import { Spin } from 'antd';
import { BSON } from 'realm-web';
import useDatabase from "../data/useDatabase";
import { Subtract } from '../utils';

function withInitialData<P extends IInjectedProps>(Component: ComponentType<P>): 
  FC<IEnhancedProps & Subtract<P, IInjectedProps>> {
  return props => {
    const { collectionName, id, ...otherProps } = props;
    const database = useDatabase();
    const [values, setValues] = useState();

    useEffect(() => {
      database?.collection(collectionName)
        .findOne({ _id: id })
        .then(results => {
          if (results) setValues(results);
        });
    }, []);
    
    if (values) return (
      <Component 
        {...otherProps as unknown as P} 
        values={values} />
    );
    return <Spin />
  }
}

export type { IInjectedProps };
export default withInitialData;

interface IEnhancedProps {
  collectionName: string
  id: BSON.ObjectId
}

interface IInjectedProps {
  values: Record<string, any>
}
