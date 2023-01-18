import { FC, useState, useId } from "react";
import styled from "styled-components";
import { List, Button, Modal } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import BasicForm from "../components/basics/BasicForm";

const { Item } = List;

// TODO: Shortcut functionality.

const Shortcuts: FC = () => {
  const [modal, setModal] = useState(false);
  const [shortcuts, setShortcuts] = useState<Array<IShortcut>>(() => {
    const cache = localStorage.getItem("shortcuts");
    return cache ? JSON.parse(cache) : [];
  });

  const addShortcut = (shortcut: IShortcut) => {
    const newShortcuts = [...shortcuts, shortcut];
    localStorage.setItem("shortcuts", JSON.stringify(newShortcuts));
    setShortcuts(newShortcuts);
  }

  const deleteShortcut = (shortcutKey: string) => {
    const newShortcuts = shortcuts.filter(shortcut => shortcut.key !== shortcutKey);
    localStorage.setItem("shortcuts", JSON.stringify(newShortcuts));
    setShortcuts(newShortcuts);
  }
  
  return (
    <Container>
      <List
        size='small'
        dataSource={shortcuts}
        renderItem={entry => (
          <Item actions={[
            <Button onClick={() => deleteShortcut(entry.key)}>Delete</Button>
          ]}>
            <ItemContainer>
              <div>{entry.key}</div>
              <div>{entry.value}</div>
            </ItemContainer>
          </Item>
        )} />
      <Button block 
        type='dashed' 
        icon={<PlusOutlined />}
        onClick={() => setModal(true)}>
        New
      </Button>
      <Modal centered maskClosable
        title="New Shortcut"
        visible={modal}
        onCancel={() => setModal(false)}
        footer={null}
        width={600}
        style={{ padding: '30px 0' }}>
        <BasicForm 
          key={useId()} // TODO: Fix this not generating a unique key on every render.
          onSubmit={values => {
            addShortcut(values);
            setModal(false);
          }}
          formItems={[
            { key: 'key', label: 'Tombol' },
            { key: 'value', label: 'Sama Dengan' }
          ]} />
      </Modal>
    </Container>
  );
}

export default Shortcuts;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;
`;

const ItemContainer = styled.div`
  display: flex;

  > div:first-of-type {
    width: 20vw;
    font-weight: 500;
  }
`;

interface IShortcut {
  key: string
  value: string
}
