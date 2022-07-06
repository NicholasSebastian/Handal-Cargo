import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { Component, ComponentType, PropsWithChildren, createContext, useContext } from 'react';
import * as Realm from 'realm-web';

const REALM_APP_ID = "application-0-frqqk";
const CLUSTER_NAME = "mongodb-atlas";
const DATABASE_NAME = "Primary";

const instance = new Realm.App({ id: REALM_APP_ID });
const DatabaseContext = createContext<Realm.App|undefined>(undefined);

function useUser() {
	const session = useContext(DatabaseContext);
	const user = session?.currentUser;
  user?.refreshCustomData();
  return user;
}

function useDatabase() {
  const user = useUser();
  const client = user?.mongoClient(CLUSTER_NAME);
  return client?.db(DATABASE_NAME);
}

function logoutAndClose() {
  localStorage.clear();
  appWindow.close();
}

class DatabaseProvider extends Component<PropsWithChildren<IProps>> {
  render() {
    const { Login, children } = this.props;
    if (instance.currentUser) {
      // If a database session user exists, unlock the window.
      appWindow.setResizable(true);
      appWindow.setSize(new LogicalSize(1280, 720));
      setTimeout(() => appWindow.center(), 50);
      
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

export { DatabaseProvider, useUser, logoutAndClose };
export default useDatabase;
export type { ILoginProps };

interface IProps {
  Login: ComponentType<ILoginProps>
}

interface ILoginProps {
  login: (username: string, password: string) => Promise<void>
}
