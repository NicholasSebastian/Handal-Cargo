import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Layout as AntLayout, Dropdown, Button, Avatar, Menu, message } from 'antd';
import { UserOutlined, FontColorsOutlined, LogoutOutlined } from "@ant-design/icons";
import { useUser, logoutAndClose } from '../data/useDatabase';

const { Header: AntHeader } = AntLayout;

const Header: FC = () => {
  const user = useUser();
  const navigate = useNavigate();

  const overlay = (
    <Menu items={[
      { key: 'profile', label: 'Profil', icon: <UserOutlined />, onClick: () => navigate('/profil') },
      { key: 'shortcut', label: 'Shortcuts', icon: <FontColorsOutlined />, onClick: () => message.error('Work in Progress') },
      { key: 'logout', label: 'Log Out dan Keluar', icon: <LogoutOutlined />, onClick: logoutAndClose }
    ]} />
  );

  return (
    <Container>
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
  justify-content: end;
  align-items: center;

  button:last-child {
    font-weight: 500;

    > span:first-child {
      margin-right: 7px;
    }
  }
`;
