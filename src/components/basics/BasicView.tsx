import { FC } from 'react';
import styled from 'styled-components';
import { Descriptions } from 'antd';
import { IInjectedProps } from '../abstractions/withInitialData';

const { Item } = Descriptions;

// Creates a basic view out of the given data values.

const BasicView: FC<IViewProps> = (props) => {
  const { title, viewItems, values } = props;

  return (
    <Container 
      title={title} 
      column={(viewItems.length > 8) ? 2 : 1}
      labelStyle={{ fontWeight: 500 }}>
      {viewItems.map(item => (
        <Item 
          key={item.key}
          label={item.label}>
          {item.render ? item.render(values[item.key]) : values[item.key]}
        </Item>
      ))} 
    </Container>
  );
}

export type { IViewItem };
export default BasicView;

const Container = styled(Descriptions)`
  width: calc(100% - 100px);

  > div {
    padding-bottom: 50px;
  }
`;

interface IViewProps extends IInjectedProps {
  title?: string
  viewItems: Array<IViewItem>
}

interface IViewItem {
  key: string
  label: string
  render?: (value: any) => any
}
