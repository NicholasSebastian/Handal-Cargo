import { open } from '@tauri-apps/api/shell';
import { WebviewWindow } from "@tauri-apps/api/window";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Layout as AntLayout, Dropdown, Button, Avatar, Menu } from 'antd';
import { UserOutlined, FontColorsOutlined, WhatsAppOutlined, UpSquareOutlined, LogoutOutlined } from "@ant-design/icons";
import { useUser, logoutAndClose } from '../../data/useDatabase';
import { dateToString, getCpuLoad, getMemoryLoad, getMemoryUsage } from '../../utils';

const { Header: AntHeader } = AntLayout;
const currentDate = dateToString(new Date());

const MONGODB_REALM_URL = "https://realm.mongodb.com/";
const STAT_REFRESH_FREQUENCY = 5000;

// Intended for use within the Layout component.

function openWhatsApp() {
  new WebviewWindow("whatsapp-window", {
    center: true, 
    focus: true, 
    title: "WhatsApp",
    url: "https://web.whatsapp.com/"
  });
}

const Header: FC<IHeaderProps> = props => {
  const { showServerButton } = props;
  const user = useUser();
  const navigate = useNavigate();

  const [cpuLoad, setCpuLoad] = useState<string>();
  const [ramLoad, setRamLoad] = useState<string>();

  const updateStats = () => {
    getCpuLoad().then(setCpuLoad);
    getMemoryLoad().then(setRamLoad);
  };

  useEffect(() => {
    updateStats();
    const loop = setInterval(updateStats, STAT_REFRESH_FREQUENCY);
    return () => clearInterval(loop);
  }, []);

  // The buttons to be displayed in the header dropdown.
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
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: <WhatsAppOutlined />,
      onClick: openWhatsApp 
    },
    ...(showServerButton ? [{ 
      key: 'server', 
      label: 'Dasbor Server', 
      icon: <UpSquareOutlined />, 
      onClick: () => open(MONGODB_REALM_URL) 
    }] : []),
    { 
      key: 'logout', 
      label: 'Log Out dan Keluar', 
      icon: <LogoutOutlined />, 
      onClick: logoutAndClose 
    }
  ];

  return (
    <Container>
      <div>
        <span>{cpuLoad}</span>
        <span>{ramLoad}</span>
      </div>
      <div>
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
      </div>
    </Container>
  );
}

export { openWhatsApp };
export default Header;

const Container = styled(AntHeader)`
  background-color: #fff;
  height: 50px;
  line-height: normal;
  padding: 0 17px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div:first-child > span {
    display: block;
    line-height: 15px;
    font-size: 11px;
    font-family: monospace;
    user-select: none;
  }

  > div:last-child {
    display: flex;
    align-items: center;

    > div:first-child {
      user-select: none;
    }

    > button {
      font-weight: 500;
      margin-left: 15px;

      > span:last-child {
        margin-left: 7px;
        margin-top: -2px;
      }
    }
  }
`;

interface IHeaderProps {
  showServerButton: boolean
}
