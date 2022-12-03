import { FC } from 'react';
import withInitialData, { IEnhancedProps } from './withInitialData';
import BasicView, { IViewItem } from './BasicView';

const FallbackView: FC<IViewProps> = props => {
  const { /* TODO */ } = props;

  return (
    <div></div> // TODO
  );
}

export default FallbackView;

interface IViewProps {
  // TODO
}
