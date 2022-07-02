import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { FC, ComponentType, PropsWithChildren, createContext, useContext } from 'react';
import * as Realm from 'realm-web';
import useSessionState from './useSessionState';

const REALM_APP_ID = "application-0-frqqk";

type User = Realm.User | undefined;
const DatabaseContext = createContext<User>(undefined);

function useDatabase() {
	const user = useContext(DatabaseContext);
	return user!;
}

const DatabaseProvider: FC<PropsWithChildren<IProps>> = ({ Login, children }) => {
	const [user, setUser] = useSessionState<Realm.User>('user');
	return user ? (
    // If a database session user exists, render the children.
		<DatabaseContext.Provider value={user}>{children}</DatabaseContext.Provider>
	) : (
    // If it does not exist, render the Login component.
    <Login login={(username, password) => 
      new Promise((resolve, reject) => {
        const app = new Realm.App({ id: REALM_APP_ID });
        const credentials = Realm.Credentials.function({ username, password });
        app.logIn(credentials)
          .then(user => { 
            // On successful login, unlock the window and set the session user.
            appWindow.setResizable(true);
            appWindow.setSize(new LogicalSize(1280, 720));
            setTimeout(() => appWindow.center(), 10);
            setUser(user); 
            resolve(undefined);
          })
          .catch(err => reject(err));
      }
    )} />
  );
}

export { DatabaseProvider };
export default useDatabase;
export type { ILoginProps };

interface IProps {
  Login: ComponentType<ILoginProps>
}

interface ILoginProps {
  login: (username: string, password: string) => Promise<any>
}
