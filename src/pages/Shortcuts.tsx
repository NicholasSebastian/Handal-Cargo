import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { FC, useState, useId } from "react";
import styled from "styled-components";
import { List, Button, Modal, Alert, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import BasicForm from "../components/basics/BasicForm";
import { isInputElement } from "../utils";

const { Item } = List;

// https://stackoverflow.com/questions/40894637/how-to-programmatically-fill-input-elements-built-with-react/70848568

function setNativeValue(element: Element, value: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter?.call(element, value);
  } 
  else {
    valueSetter?.call(element, value);
  }
}

const Shortcuts: FC = () => {
  const [modal, setModal] = useState(false);
  const [shortcuts, setShortcuts] = useState<Array<IShortcut>>(() => {
    const cache = localStorage.getItem("shortcuts");
    return cache ? JSON.parse(cache) : [];
  });

  const addShortcut = (shortcut: IShortcut) => {
    if (shortcuts.some(sc => sc.key === shortcut.key)) {
      message.error("Tombol ini sudah terpakai.");
    }
    else {
      const newShortcuts = [...shortcuts, shortcut];
      localStorage.setItem("shortcuts", JSON.stringify(newShortcuts));
      setShortcuts(newShortcuts);
      register(shortcut.key, () => {
        const focus = document.activeElement;
        if (focus && isInputElement(focus)) {
          const left = focus.value.substring(0, focus.selectionStart!);
          const right = focus.value.substring(focus.selectionEnd!);
          setNativeValue(focus, left + shortcut.value + right);
          focus.dispatchEvent(new Event("input", { bubbles: true }));
        }
      });
      setModal(false);
    }
  }

  const deleteShortcut = (shortcutKey: string) => {
    const newShortcuts = shortcuts.filter(shortcut => shortcut.key !== shortcutKey);
    localStorage.setItem("shortcuts", JSON.stringify(newShortcuts));
    setShortcuts(newShortcuts);
    unregister(shortcutKey);
  }
  
  return (
    <Container>
      <Alert banner 
        type="info" 
        message="Contoh tombol yang bisa digunakan seperti 'F12', 'Ctrl+K', 'CommandOrControl+Shift+C', dll." />
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
          onSubmit={values => addShortcut(values)}
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
