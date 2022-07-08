import { FC } from 'react';
import { Descriptions } from 'antd';
import { useUser } from '../data/useDatabase';

const { Item } = Descriptions;

const Profile: FC = () => {
  const user = useUser();
  return (
    <pre>{JSON.stringify(user?.customData, null, 2)}</pre>
  );
}

export default Profile;
