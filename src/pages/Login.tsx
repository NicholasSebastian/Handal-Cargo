import { FC, useState } from 'react';
import { ILoginProps } from '../data/useDatabase';

const Login: FC<ILoginProps> = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
	return (
		<div>
      <input type='text' value={username} onChange={e => setUsername(e.target.value)} />
      <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={() => login(username, password)} />
    </div>
	);
}

export default Login;
