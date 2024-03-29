import { FC, PropsWithChildren, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Layout as AntLayout, Tabs, TabsProps, PageHeader } from 'antd';
import { toSlug, fromSlug } from '../../utils';
import Header from '../specialized/Header';
import Sider from './Sider';

const { Content } = AntLayout;
const { TabPane } = Tabs;

// Intended for use at the base of the app, wrapping around all other pages.

function loadTabs() {
  const cachedTabs = sessionStorage.getItem('tabs');
  return cachedTabs ? JSON.parse(cachedTabs) : [];
}

const Layout: FC<PropsWithChildren<{}>> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tabs, setTabs] = useState<Array<string>>(loadTabs);
  const [active, setActive] = useState('');
  const [access, setAccess] = useState<Array<string>>();

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

  // 'Memoize' the tabs with session storage so it persists whenever the layout is unmounted during printing.
  useEffect(() => sessionStorage.setItem('tabs', JSON.stringify(tabs)), [tabs]);

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
      <GlobalStyles />
      <Sider 
        active={active} 
        access={access} 
        setAccess={setAccess} />
      <AntLayout>
        <Header showServerButton={access?.includes('backup-and-restore') ?? false} />
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

const GlobalStyles = createGlobalStyle`
  div.ant-form-item {
    margin-bottom: 15px;
  }
`;

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

type TabsCallback = Required<TabsProps>['onEdit'];
