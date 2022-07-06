import { FC } from 'react';
import { useUser } from '../data/useDatabase';

const Profile: FC = () => {
  const user = useUser();
  return (
    <pre>{JSON.stringify(user?.customData, null, 2)}</pre>
  );
}

export default Profile;
