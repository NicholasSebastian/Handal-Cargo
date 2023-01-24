import { FC } from 'react';
import styled from 'styled-components';
import { Descriptions } from 'antd';
import useProfile from '../data/useProfile';

const { Item } = Descriptions;

const Profile: FC = () => {
  const profile = useProfile();
  return (
    <Container>
      <Descriptions title="User Profile" labelStyle={{ fontWeight: 500 }}>
        <Item label="Nama">{profile.name}</Item>
        <Item label="Level Akses">{profile.access_level}</Item>
        <Item label="Kelompok Staff">{profile.staff_group}</Item>
        <Item label="Kelamin">{profile.gender}</Item>
        <Item label="Alamat">{profile.address}</Item>
        <Item label="Kecamatan">{profile.ward}</Item>
        <Item label="Kota">{profile.city}</Item>
        <Item label="Nomor Rumah">{profile.home_number}</Item>
        <Item label="Nomor HP">{profile.phone_number}</Item>
        <Item label="Tempat Lahir">{profile.birthplace}</Item>
        <Item label="Tanggal Lahir">{profile.birthday?.toLocaleDateString()}</Item>
        <Item label="Tanggal Kerja">{profile.employment_date?.toLocaleDateString()}</Item>
      </Descriptions>
    </Container>
  );
}

export default Profile;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;
`;
