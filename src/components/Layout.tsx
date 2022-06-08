import { FC, PropsWithChildren, useState, useEffect, isValidElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout as AntLayout, Menu, MenuProps, Tabs, TabsProps } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, AppstoreOutlined, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import pages from '../navigation';
import { toSlug, fromSlug } from '../utils';

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
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(DEFAULT_GROUP);
  const [tabs, setTabs] = useState<Array<string>>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    // Executes when the location changes.
    const newTabKey = location.pathname.slice(1);
    const tabExists = tabs.some(tab_name => toSlug(tab_name) === newTabKey);

    // Changes the active key to the new location.
    setActive(newTabKey);
    
    // Adds a new tab if the respective tab does not exist yet.
    if (!tabExists) {
      const newTab = fromSlug(newTabKey);
      setTabs([...tabs, newTab]);
    }

  }, [location]);

  const onEdit: TabsCallback = (key, action) => {
    // Executes when a tab is deleted.
    if (action === 'remove') {
      const targetIndex = tabs.findIndex(tab_name => toSlug(tab_name) === key);
      const target = tabs[targetIndex];
      const targetKey = toSlug(target);
      
      // Changes the active key if the one being deleted is currently active.
      if (targetKey === active) {
        const isRightmost = (targetIndex < tabs.length - 1);
        const newActiveIndex = isRightmost ? (targetIndex + 1) : (targetIndex - 1);
        const newActive = tabs[newActiveIndex];
        const newActiveKey = toSlug(newActive);
        setActive(newActiveKey);
      }

      // Delete the tab.
      const before = tabs.slice(0, targetIndex);
      const after = tabs.slice(targetIndex + 1);
      setTabs([...before, ...after]);
    }
  };

  return (
    <Container>
      <Sider collapsible collapsed={collapsed} trigger={null} width={220}>
        <Title>Handal Cargo</Title>
        <Menu theme='dark' mode='inline' items={menuItems}
          openKeys={[open]} onOpenChange={keys => setOpen(keys.find(key => key !== open)!)}
          selectedKeys={[active]} onSelect={e => navigate(e.key)} />
      </Sider>
      <AntLayout>
        <Header style={{ backgroundColor: '#fff' }}>
          {collapsed ? 
            <MenuUnfoldOutlined onClick={() => setCollapsed(false)} /> : 
            <MenuFoldOutlined onClick={() => setCollapsed(true)} />
          }
        </Header>
        <Tabs type='editable-card' hideAdd activeKey={active} 
          onChange={key => navigate(key)} onEdit={onEdit}>
          {tabs.map(tab_name => (
            // TODO
            <TabPane closable={tabs.length > 1} key={toSlug(tab_name)} tab={tab_name}>{tab_name}</TabPane>
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