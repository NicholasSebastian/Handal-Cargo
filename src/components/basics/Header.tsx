import { open } from '@tauri-apps/api/shell';
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Layout as AntLayout, Dropdown, Button, Avatar, Menu } from 'antd';
import { UserOutlined, FontColorsOutlined, LogoutOutlined, UpSquareOutlined } from "@ant-design/icons";
import { useUser, logoutAndClose } from '../../data/useDatabase';

const { Header: AntHeader } = AntLayout;
const MONGODB_REALM_URL = "https://realm.mongodb.com/";

const serverButton = { 
  key: 'server', 
  label: 'Dasbor Server', 
  icon: <UpSquareOutlined />, 
  onClick: () => open(MONGODB_REALM_URL) 
};

const currentDate = new Date()
  .toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const Header: FC<IHeaderProps> = props => {
  const { showServerButton } = props;
  const user = useUser();
  const navigate = useNavigate();

  const menuItems = [
    { 
      key: 'profile', 
      label: 'Profil', 
      icon: <UserOutlined />, 
      onClick: () => navigate('/profile') 
    },
    { 
      key: 'shortcut', 
      label: 'Shortcuts', 
      icon: <FontColorsOutlined />, 
      onClick: () => navigate('/shortcuts') 
    },
    ...(showServerButton ? [serverButton] : []),
    { 
      key: 'logout', 
      label: 'Log Out dan Keluar', 
      icon: <LogoutOutlined />, 
      onClick: logoutAndClose 
    }
  ];

  return (
    <Container>
      <div>{currentDate}</div>
      <Dropdown 
        placement='bottomRight'
        overlay={
          <Menu items={menuItems} />
        }>
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

interface IHeaderProps {
  showServerButton: boolean
}
