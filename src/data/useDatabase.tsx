import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { Component, ComponentType, PropsWithChildren, createContext, useContext } from 'react';
import * as Realm from 'realm-web';
import { clearLocalStorage } from '../utils';

// Database credentials. This should be a secret but oh well.
const REALM_APP_ID = "application-0-frqqk";
const CLUSTER_NAME = "mongodb-atlas";
const DATABASE_NAME = "Primary";

const DEFAULT_WINDOW_SIZE = new LogicalSize(1280, 720);
const MIN_WINDOW_SIZE = new LogicalSize(1000, 720);

const instance = new Realm.App({ id: REALM_APP_ID });
const DatabaseContext = createContext<Realm.App|undefined>(undefined);

// Intended for use to be wrapped around the entire app to handle authentication logic.

class DatabaseProvider extends Component<PropsWithChildren<IProps>> {
  render() {
    const { Login, children } = this.props;
    if (instance.currentUser) {
      // If a database session user exists, unlock the window.
      appWindow.setSize(DEFAULT_WINDOW_SIZE)
        .then(() => appWindow.setMinSize(MIN_WINDOW_SIZE))
        .then(() => appWindow.setResizable(true))
        .then(() => appWindow.center());
      
      // Make sure to clear the authentication data when the app is closed.
      appWindow.once('tauri://close-requested', logoutAndClose);
  
      // Render the children.
      return (
        <DatabaseContext.Provider value={instance}>{children}</DatabaseContext.Provider>
      );
    }
    return (
      // If it does not exist, render the Login component.
      <Login login={(username, password) => 
        new Promise((resolve, reject) => {
          const credentials = Realm.Credentials.function({ username, password });
          instance.logIn(credentials)
            .then(() => resolve())
            .catch(err => reject(err))
            .finally(() => this.forceUpdate());
        }
      )} />
    );
  }
}

// Returns the current authenticated user.
function useUser() {
	const session = useContext(DatabaseContext);
	const user = session?.currentUser;
  return user;
}

// Returns the current database instance.
function useDatabase() {
  const user = useUser();
  const client = user?.mongoClient(CLUSTER_NAME);
  return client?.db(DATABASE_NAME);
}

// Clears any authentication data from the cache then closes the app.
function logoutAndClose() {
  clearLocalStorage('realm-web');
  appWindow.close();
}

export type { ILoginProps };
export { DatabaseProvider, useUser, logoutAndClose, DEFAULT_WINDOW_SIZE };
export default useDatabase;

interface IProps {
  Login: ComponentType<ILoginProps>
}

interface ILoginProps {
  login: (username: string, password: string) => Promise<void>
}
