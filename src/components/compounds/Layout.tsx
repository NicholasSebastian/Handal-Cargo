import { FC, PropsWithChildren, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Layout as AntLayout, Tabs, TabsProps, PageHeader } from 'antd';
import { toSlug, fromSlug } from '../../utils';
import Header from '../basics/Header';
import Sider from '../basics/Sider';

type TabsCallback = Required<TabsProps>['onEdit'];

const { Content } = AntLayout;
const { TabPane } = Tabs;

const Layout: FC<PropsWithChildren<{}>> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tabs, setTabs] = useState<Array<string>>([]);
  const [active, setActive] = useState('');

  // Executes when the location changes.
  useEffect(() => {
    if (location.pathname === '/') return;
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
        navigate('/' + newActiveKey);
      }

      // Delete the tab.
      const before = tabs.slice(0, targetIndex);
      const after = tabs.slice(targetIndex + 1);
      setTabs([...before, ...after]);
    }
  };

  return (
    <Container>
      <Sider active={active} />
      <AntLayout>
        <Header />
        <Tabs hideAdd 
          type='editable-card' 
          activeKey={active} 
          onChange={key => navigate(key)} 
          onEdit={onEdit}>
          {tabs.map(tab_name => (
            <TabPane 
              closable={tabs.length > 1} 
              key={toSlug(tab_name)} 
              tab={tab_name}>
              <PageHeader title={tab_name} ghost={false} />
            </TabPane>
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

  aside.ant-layout-sider h3 {
    color: #fff;
    text-align: center;
    margin: 20px 0;
  }

  main.ant-layout-content {
    overflow-y: scroll;
    height: 0; // Explicit height value required for scroll to work.
  }

  div.ant-tabs-nav {
    margin-bottom: 0;
    user-select: none;
  }

  div.ant-page-header {
    padding: 8px 24px;
  }
`;
