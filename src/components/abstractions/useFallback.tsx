import { FC, ComponentType, Fragment } from "react";

// "arg" can be a ComponentType, an array of items, or props.
// I tried implementing these type constraints but TypeScript was a bitch so it wasn't worth it.

function useFallback<T>(arg: ComponentType<T> | Array<any> | any, Fallback: ComponentType<any>) {
  // If "arg" is a component type, return it as it is.
  if (typeof arg === 'function') 
    return arg as ComponentType<T>;

  // To make TypeScript shut the hell up.
  const UnfuckedFallback = Fallback as any;

  // If "arg" is of "Fallback"'s "items" prop, return the Fallback component with the items injected.
  if (Array.isArray(arg)) {
    const fallback: FC<any> = props => <UnfuckedFallback {...props} items={arg} />
    return fallback;
  }

  // If "arg" is of "Fallback"'s prop type, return the Fallback component with the "arg"s injected.
  if (typeof arg === 'object') {
    const fallback: FC<any> = props => <UnfuckedFallback {...props} {...arg} />;
    return fallback;
  }

  return Fragment;
}

export default useFallback;
