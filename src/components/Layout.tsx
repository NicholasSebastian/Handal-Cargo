import { FC, PropsWithChildren, useState, useEffect, isValidElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout as AntLayout, Menu, MenuProps, Tabs, TabsProps } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, AppstoreOutlined, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import pages from '../navigation';
import { toSlug } from '../utils';

type MenuItem = Required<MenuProps>['items'][number];
type TabsCallback = Required<TabsProps>['onEdit'];

const DEFAULT_GROUP = 'shipping';

const { Header, Sider, Content } = AntLayout;
const { TabPane } = Tabs;
const icons = [ AppstoreOutlined, PlusCircleOutlined, SettingOutlined ];

const menuItems = Object.entries(pages).map(([name, component], i): MenuItem => {
  const Icon = icons[i];
  const item = { key: toSlug(name), label: name, icon: <Icon /> };
  return isValidElement(component) ? item : (
    { ...item,
      children: Object.entries(component).map(([nested_name]) => (
        { key: toSlug(nested_name), label: nested_name }
      ))
    }
  );
});

const Layout: FC<PropsWithChildren<{}>> = (props) => {
  // Sidebar state.
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(DEFAULT_GROUP);
  const [selected, setSelected] = useState('');

  // Tabs state.
  const [tabs, setTabs] = useState([]);
  const [active, setActive] = useState('');

  const location = useLocation();
  useEffect(() => {
    setSelected(location.pathname.slice(1));
    // TODO: Change to the respective tab whenever the location changes.
    // TODO: Add a new tab if the respective tab does not exist yet.
  }, [location]);

  const onEdit: TabsCallback = (key, action) => {
    if (action === 'remove') {
      // TODO: Remove the target tab.
      // TODO: Set the active tab to the one directly after/before it if its currently selected.
    }
  };

  return (
    <Container>
      <Sider collapsible collapsed={collapsed} trigger={null} width={220}>
        <Title>Handal Cargo</Title>
        <Menu theme='dark' mode='inline' items={menuItems}
          openKeys={[open]} onOpenChange={keys => setOpen(keys.find(key => key !== open)!)}
          selectedKeys={[selected]} onSelect={e => navigate(e.key)} />
      </Sider>
      <AntLayout>
        <Header style={{ backgroundColor: '#fff' }}>
          {collapsed ? 
            <MenuUnfoldOutlined onClick={() => setCollapsed(false)} /> : 
            <MenuFoldOutlined onClick={() => setCollapsed(true)} />
          }
        </Header>
        <Tabs type='editable-card' hideAdd activeKey={active} 
          onChange={key => setActive(key)} onEdit={onEdit}>
          {tabs.map(tab => (
            <TabPane>{}</TabPane>
          ))}
        </Tabs>
        <Content>{props.children}</Content>
      </AntLayout>
    </Container>
  );
}

export default Layout;

const Container = styled(AntLayout)`
  min-height: 100vh;
`;

const Title = styled.h2`
  color: #fff;
  text-align: center;
  margin: 20px 0;
`;
