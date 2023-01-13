import { FC, ComponentType, useId } from 'react';
import withInitialData, { IEnhancedProps, IInjectedProps } from '../abstracts/withInitialData';
import BasicView, { IViewItem } from '../basics/BasicView';

const isComponent = (component: any): component is ViewComponentType => typeof component === 'function';

const FallbackView: FC<IViewProps> = props => {
  const { view, id, collectionName } = props;
  const key = useId(); // Will never reuse views.
  const viewProps = { key, id, collectionName };

  // Render the given view component if given a component.
  if (isComponent(view)) {
    const ViewComponent = withInitialData(view);
    return (
      <ViewComponent {...viewProps} />
    );
  }
  // Render a BasicView component if the given view prop is undefined or an array of items.
  else {
    const ViewComponent = withInitialData(BasicView);
    return (
      <ViewComponent {...viewProps} viewItems={view} />
    );
  }
}

export type { ViewPropType };
export default FallbackView;

interface IViewProps extends IEnhancedProps {
  view: ViewPropType
}

type ViewComponentType = ComponentType<IInjectedProps>;
type ViewPropType = ViewComponentType | Array<IViewItem>;
