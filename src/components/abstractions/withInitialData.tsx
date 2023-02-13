import { FC, ComponentType, useState } from 'react';
import { Spin } from 'antd';
import { BSON } from 'realm-web';
import { useBasicDataFetching, BasicQuery } from './useDataFetching';
import { Subtract } from '../../utils';

// Abstracts over the components to inject data from the database matching its 'id'.

function withInitialData<P extends IInjectedProps>(Component: ComponentType<P>, customQuery?: BasicQuery): 
  FC<IEnhancedProps & Subtract<P, IInjectedProps>> {
  return props => {
    const { collectionName, id, ...otherProps } = props;
    const [values, setValues] = useState();
    useBasicDataFetching(collectionName, id, setValues, customQuery);
    
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
