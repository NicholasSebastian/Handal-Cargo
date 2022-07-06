import { FC } from "react";
import styled from "styled-components";
import { Layout as AntLayout, Dropdown, Button, Avatar, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { logoutAndClose } from '../data/useDatabase';

const { Header: AntHeader } = AntLayout;
const { Item } = Menu;

// TODO: Replace menu children with menu items instead.
// TODO: Store and retrieve the user's username.

const overlay = (
  <Menu>
    <Item icon={<UserOutlined />}>Profil</Item>
    <Item icon={<LogoutOutlined />} onClick={logoutAndClose}>Log Out dan Keluar</Item>
  </Menu>
);

const Header: FC = () => {
  return (
    <Container>
      <Dropdown overlay={overlay} placement='bottomRight'>
        <Button type='text'>
          {'test name'}
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

  button:last-child > span:first-child {
    margin-right: 7px;
  }
`;
