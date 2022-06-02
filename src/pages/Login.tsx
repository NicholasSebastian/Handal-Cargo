import { FC, useState } from 'react';
import { ILoginProps } from '../data/useDatabase';

const Login: FC<ILoginProps> = ({ login }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = () => {
    setLoading(true);
    login(username, password)
      .catch(() => setError("Invalid Credentials."))
      .finally(() => setLoading(false));
  };

	return loading ? (
    <div>Loading...</div>
  ) : (
		<div>
      {error && <div>{error}</div>}
      <input type='text' placeholder='Username' value={username} 
        onChange={e => setUsername(e.target.value)} />
      <input type='password' placeholder='Password' value={password} 
        onChange={e => setPassword(e.target.value)} />
      <button onClick={onSubmit}>Login</button>
    </div>
	);
}

export default Login;
