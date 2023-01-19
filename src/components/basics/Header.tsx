import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Layout as AntLayout, Dropdown, Button, Avatar, Menu } from 'antd';
import { UserOutlined, FontColorsOutlined, LogoutOutlined } from "@ant-design/icons";
import { useUser, logoutAndClose } from '../../data/useDatabase';

const { Header: AntHeader } = AntLayout;

const currentDate = new Date()
  .toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const Header: FC = () => {
  const user = useUser();
  const navigate = useNavigate();

  const overlay = (
    <Menu items={[
      { key: 'profile', label: 'Profil', icon: <UserOutlined />, onClick: () => navigate('/profile') },
      { key: 'shortcut', label: 'Shortcuts', icon: <FontColorsOutlined />, onClick: () => navigate('/shortcuts') },
      { key: 'logout', label: 'Log Out dan Keluar', icon: <LogoutOutlined />, onClick: logoutAndClose }
    ]} />
  );

  return (
    <Container>
      <div>{currentDate}</div>
      <Dropdown overlay={overlay} placement='bottomRight'>
        <Button type='text'>
          {user?.profile.name}
          <Avatar size={28} icon={<UserOutlined />} />
        </Button>
      </Dropdown>
    </Container>
  );
}

export default Header;

const Container = styled(AntHeader)`
  background-color: #fff;
  height: 50px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div:first-child {
    user-select: none;
  }

  button:last-child {
    font-weight: 500;

    > span:first-child {
      margin-right: 7px;
    }
  }
`;
