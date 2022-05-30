import { ComponentType, createContext, useState, useEffect, useContext } from 'react';
import * as Realm from 'realm-web';

type User = Realm.User | undefined;
const DatabaseContext = createContext<User>(undefined);

function useDatabase() {
	const user = useContext(DatabaseContext);
	return user?.functions;
}

function withDatabase(Component: ComponentType) {
	return () => {
		const [user, setUser] = useState<Realm.User>();
		useEffect(() => {
			const REALM_APP_ID = "TODO";
			const app = new Realm.App({ id: REALM_APP_ID });
			const credentials = Realm.Credentials.anonymous();
			app.logIn(credentials)
				.then(user => setUser(user))
				.catch(err => console.error(err));
		}, []);

		return (
			<DatabaseContext.Provider value={user}>
				<Component />
			</DatabaseContext.Provider>
		);
	}
}

export { withDatabase };
export default useDatabase;
