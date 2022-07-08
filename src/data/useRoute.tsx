import { isValidElement, createContext, useContext } from "react";
import { Route } from "react-router-dom";
import pages from '../navigation';
import { toSlug } from '../utils';

const RouteContext = createContext<IRoute|undefined>(undefined);

// Returns the route mapped to the React Component (not the current location).
function useRoute() {
  return useContext(RouteContext);
}

// Maps the pages defined in 'navigation.tsx' into Route elements.
const routes = Object.entries(pages).map(([name, component]) => {
  if (isValidElement(component)) {
    const slug = toSlug(name);
    return (
      <Route key={name} path={slug} element={
        <RouteContext.Provider value={{ path: slug, title: name }}>
          {component}
        </RouteContext.Provider>
      } />
    );
  }
  return Object.entries(component).map(([nested_name, nested_component]) => {
    const slug = toSlug(nested_name);
    return (
      <Route key={nested_name} path={slug} element={
        <RouteContext.Provider value={{ path: slug, title: nested_name }}>
          {nested_component}
        </RouteContext.Provider>
      } />
    );
  });
});

export { routes };
export default useRoute;

interface IRoute {
  path: string
  title: string
}
