import { FC } from 'react';
import styled from 'styled-components';
import { Descriptions } from 'antd';
import { IInjectedProps } from '../abstractions/withInitialData';

const { Item } = Descriptions;

// Creates a basic view out of the given data values.

const BasicView: FC<IViewProps> = (props) => {
  const { title, items, values } = props;

  return (
    <Container 
      title={title} 
      column={(items.length > 8) ? 2 : 1}
      labelStyle={{ fontWeight: 500 }}>
      {items.map(item => (
        <Item 
          key={item.key}
          label={item.label}>
          {item.render ? item.render(values[item.key]) : values[item.key]}
        </Item>
      ))} 
    </Container>
  );
}

export type { IViewProps, IViewItem };
export default BasicView;

const Container = styled(Descriptions)`
  width: calc(100% - 100px);

  > div {
    padding-bottom: 50px;
  }
`;

interface IViewProps extends IInjectedProps {
  title?: string
  items: Array<IViewItem>
}

interface IViewItem {
  key: string
  label: string
  render?: (value: any) => any
}
