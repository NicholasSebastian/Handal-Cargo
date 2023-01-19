import { FC, useState, useEffect, useMemo, isValidElement } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Layout, Typography, Menu, MenuProps, Alert } from "antd";
import { AppstoreOutlined, PlusCircleOutlined, SettingOutlined } from '@ant-design/icons';
import useDatabase from '../../data/useDatabase';
import useProfile from '../../data/useProfile';
import pages from '../../navigation';
import { toSlug } from '../../utils';

const { Sider: AntSider } = Layout;
const { Title } = Typography;
const icons = [ AppstoreOutlined, PlusCircleOutlined, SettingOutlined ];

const DEFAULT_GROUP = 'shipping';

const Sider: FC<ISiderProps> = props => {
  const { active } = props;
  const profile = useProfile();
  const database = useDatabase();
  const navigate = useNavigate();
  
  const [open, setOpen] = useState(DEFAULT_GROUP);
  const [access, setAccess] = useState<Array<string>>();
  const [loading, setLoading] = useState(false);

  const menuItems = useMemo(() => Object.entries(pages)
    .map(([name, component], i): MenuItem => {
      const Icon = icons[i];
      const item = { key: toSlug(name), label: name, icon: <Icon /> };
      return isValidElement(component) ? item : (
        { ...item,
          children: Object.entries(component)
            .filter(([nested_name]) => access?.includes(toSlug(nested_name)))
            .map(([nested_name]) => (
              { key: toSlug(nested_name), label: nested_name }
            ))
        }
      );
    })
    .filter((item: any) => item?.children?.length > 0), 
  [access]);

  useEffect(() => {
    setLoading(true);
    database?.collection("AccessLevels")
      .findOne({ name: profile.access_level })
      .then(result => setAccess(result.access_level))
      .finally(() => setLoading(false));
  }, [profile]);

  return (
    <AntSider trigger={null} width={220}>
      <Title level={3}>Handal Cargo</Title>
      <Menu theme='dark' 
        mode='inline' 
        items={menuItems}
        openKeys={[open]} 
        onOpenChange={keys => setOpen(keys.find(key => key !== open)!)}
        selectedKeys={[active]} 
        onSelect={e => navigate(e.key)} />
      {loading && <Message message="Loading..." type="info" showIcon />}
    </AntSider>
  );
}

export default Sider;

const Message = styled(Alert)`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

interface ISiderProps {
  active: string
}

type MenuItem = Required<MenuProps>['items'][number];
