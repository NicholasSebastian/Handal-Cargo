import { FC, useState, useEffect, useMemo, isValidElement } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Layout, Typography, Menu, MenuProps, Alert, Timeline, notification } from "antd";
import { AppstoreOutlined, PrinterOutlined, PlusCircleOutlined, AccountBookOutlined, SettingOutlined } from '@ant-design/icons';
import useDatabase from '../../data/useDatabase';
import useProfile from '../../data/useProfile';
import pages from '../../navigation';
import description from "./ProductInformation";
import { toSlug } from '../../utils';

const { Sider: AntSider } = Layout;
const { Title } = Typography;

const icons = [ 
  AppstoreOutlined, 
  PrinterOutlined, 
  PlusCircleOutlined, 
  AccountBookOutlined, 
  SettingOutlined 
];

// Intended for use within the Layout component.

const Sider: FC<ISiderProps> = props => {
  const { active, access, setAccess } = props;
  const profile = useProfile();
  const database = useDatabase();
  const navigate = useNavigate();
  
  const [open, setOpen] = useState<string>();
  const [loading, setLoading] = useState(false);

  // Formats the app's pages for interpretation as menu items for navigation.
  const menuItems = useMemo(() => Object.entries(pages)
    .map(([name, component], i): MenuItem => {
      const Icon = icons[i];
      const item = { key: toSlug(name), label: name, icon: <Icon /> };

      // Return the item if it is a valid page that the user also has access to.
      if (isValidElement(component)) {
        return access?.includes(toSlug(name)) ? item : undefined as never;
      }

      // Else assume it has children, so format them appropriately as well,
      // also filtering out the ones the user doesn't have access to.
      else return { 
        ...item,
        children: Object.entries(component)
          .filter(([nested_name]) => access?.includes(toSlug(nested_name)))
          .map(([nested_name]) => (
            { key: toSlug(nested_name), label: nested_name }
          ))
      }
    })  
    .filter(item => item !== undefined) // Exclude undefined items.
    .filter((item: any) => !(item.children?.length === 0)), // Exclude menus with empty children arrays.
  [access]);

  // Loads in the page access permissions for the current logged-in user from the database.
  useEffect(() => {
    setLoading(true);
    database?.collection("AccessLevels")
      .findOne({ name: profile.access_level })
      .then(result => setAccess(result.access_level))
      .finally(() => setLoading(false));
  }, [profile]);
  
  return (
    <AntSider trigger={null} width={220}>
      <Logo 
        level={3} 
        onClick={() => {
          notification.destroy();
          notification.open({
            message: "Product Information",
            description,
            placement: 'bottomRight'
          });
        }}>
        Handal Cargo
      </Logo>
      <Menu theme='dark' 
        mode='inline' 
        items={menuItems}
        openKeys={open ? [open] : []} 
        onOpenChange={keys => setOpen(keys.find(key => key !== open)!)}
        selectedKeys={[active]} 
        onSelect={e => navigate(e.key)} />
      {loading && <Message message="Loading..." type="info" showIcon />}
    </AntSider>
  );
}

export default Sider;

const Logo = styled(Title)`
  :hover {
    cursor: help;
  }
`;

const Message = styled(Alert)`
  position: absolute;
  bottom: 10px;
  left: 10px;
`;

interface ISiderProps {
  active: string
  access: Array<string> | undefined
  setAccess: React.Dispatch<React.SetStateAction<Array<string> | undefined>>
}

type MenuItem = Required<MenuProps>['items'][number];
