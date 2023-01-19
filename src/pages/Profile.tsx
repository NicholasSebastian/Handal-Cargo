import { FC } from 'react';
import { Descriptions } from 'antd';
import useProfile from '../data/useProfile';

const { Item } = Descriptions;

const Profile: FC = () => {
  const profile = useProfile();
  return (
    <pre>{JSON.stringify(profile, null, 2)}</pre>
  );
}

export default Profile;
