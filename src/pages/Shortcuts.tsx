import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { FC, CSSProperties, useState, useId } from "react";
import styled from "styled-components";
import { List, Button, Modal, Alert, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import BasicForm from "../components/basics/BasicForm";
import { isInputElement } from "../utils";

const { Item } = List;

// Sets the value for React Input components without having access its setState.
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

// Slips in the shortcut value at the current text focus location.
function insertStringAtPos(value: string) {
  const focus = document.activeElement;
  if (focus && isInputElement(focus)) {
    const left = focus.value.substring(0, focus.selectionStart!);
    const right = focus.value.substring(focus.selectionEnd!);
    setNativeValue(focus, left + value + right);
    focus.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

const Shortcuts: FC = () => {
  const [modal, setModal] = useState(false);

  // Shortcut state with initial values taken from local storage if exists.
  const [shortcuts, setShortcuts] = useState<Array<IShortcut>>(() => {
    const cache = localStorage.getItem("shortcuts");
    return cache ? JSON.parse(cache) : [];
  });

  const addShortcut = (shortcut: IShortcut) => {
    // Prevents registering multiple values to the same shortcut key.
    if (shortcuts.some(sc => sc.key === shortcut.key)) {
      message.error("Tombol ini sudah terpakai.");
    }
    // Updates the state and local storage, then registers the shortcut key.
    else {
      const newShortcuts = [...shortcuts, shortcut];
      localStorage.setItem("shortcuts", JSON.stringify(newShortcuts));
      setShortcuts(newShortcuts);
      register(shortcut.key, () => insertStringAtPos(shortcut.value));
      setModal(false);
    }
  }

  // Deletes the shortcut from state and local storage, then unregisters it.
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
            <Button onClick={() => deleteShortcut(entry.key)}>Hapus</Button>
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
        Baru
      </Button>
      <Modal centered maskClosable
        title="Shortcut Baru"
        visible={modal}
        onCancel={() => setModal(false)}
        footer={null}
        width={600}
        bodyStyle={ModalStyles}>
        <BasicForm 
          key={useId()}
          onSubmit={values => addShortcut(values)}
          items={[
            { key: 'key', label: 'Tombol' },
            { key: 'value', label: 'Sama Dengan' }
          ]} />
      </Modal>
    </Container>
  );
}

export type { IShortcut };
export { insertStringAtPos };
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

const ModalStyles: CSSProperties = { 
  padding: '30px 0', 
  display: 'flex', 
  justifyContent: 'center'
};

interface IShortcut {
  key: string
  value: string
}
