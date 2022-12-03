import { FC } from 'react';
import { Descriptions } from 'antd';
import { IInjectedProps } from './withInitialData';

const { Item } = Descriptions;

// Creates a basic view out of the given data values.

const BasicView: FC<IViewProps> = (props) => {
  const { title, viewItems, values } = props;
  return (
    <Descriptions bordered title={title} column={1}>
      {viewItems.map(item => (
        <Item 
          key={item.key}
          label={item.label}>
          {values[item.key]?.toString()}
        </Item>
      ))}
    </Descriptions>
  );
}

export type { IViewItem };
export default BasicView;

interface IViewProps extends IInjectedProps {
  title?: string
  viewItems: Array<IViewItem>
}

interface IViewItem {
  key: string
  label: string
}
