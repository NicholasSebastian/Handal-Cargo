import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { Descriptions } from 'antd';
import { IInjectedProps } from '../abstractions/withInitialData';

const { Item } = Descriptions;
const gap = { render: () => <div /> };

// Creates a basic view out of the given data values.

const BasicView: FC<IViewProps> = (props) => {
  const { title, items, values, extra } = props;

  return (
    <Container>
      <Descriptions 
        title={title} 
        column={2}
        labelStyle={{ fontWeight: 500 }}>
        {items.map((item, i) => {
          const value = item.key ? values[item.key] : null;
          const node = item.render ? item.render(value, values) : value;
          return (
            <Item 
              key={item.key ?? i}
              label={item.label}>
              {node}
            </Item>
          );
        })} 
      </Descriptions>
      {extra}
    </Container>
  );
}

export type { IViewProps, IViewItem };
export { gap };
export default BasicView;

const Container = styled.div`
  width: calc(100% - 100px);
  padding-bottom: 50px;
`;

interface IViewProps extends IInjectedProps {
  title?: string
  items: Array<IViewItem>
  extra?: ReactNode
}

interface IViewItem {
  key?: string
  label?: string
  render?: (value: any, values: Record<string, any>) => any
}
