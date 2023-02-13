import styled from "styled-components";
import { List, Button, Modal, Popconfirm, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import withTemplateHandling, { ISharedProps } from "../abstractions/withTemplateHandling";
import withFormHandling from '../abstractions/withFormHandling';
import useFallback from '../abstractions/useFallback';
import BasicForm from '../basics/BasicForm';
import { ModalStyles, FormPropType } from "./TableTemplate";
import Search from '../basics/Search';

const { Item } = List;

const ListTemplate = withTemplateHandling<ITemplateProps>(props => {
  const { 
    collectionName, data, loading, modal, modalTitle, 
    setSearch, setModal, secondaryColumn, form, handlers 
  } = props;

  const { handleAdd, handleEdit, handleDelete } = handlers;
  const modalHasId = (modal !== null && 'id' in modal);

  const FallbackForm = useFallback(form, BasicForm);
  const HandledForm = withFormHandling(FallbackForm);

  return (
    <Container>
      <div>
        <Search onSearch={setSearch} />
        <Button block 
          type='dashed' 
          icon={<PlusOutlined />} 
          onClick={() => setModal({ mode: 'add' })}>
          Baru
        </Button>
      </div>
      <Spin spinning={loading}>
        <List 
          size='small' 
          dataSource={data} 
          loading={data === undefined}
          renderItem={(entry, i) => (
            <Item key={i} actions={[
              <Button 
                onClick={() => setModal({ mode: 'edit', id: entry._id })}>
                Edit
              </Button>,
              <Popconfirm 
                title="Yakin di hapus?" 
                placement="left"
                onCancel={e => e?.stopPropagation()}
                onConfirm={e => {
                  e?.stopPropagation();
                  handleDelete(entry._id);
                }}>
                <Button onClick={e => e.stopPropagation()}>Hapus</Button>
              </Popconfirm>
            ]}>
              <ItemContainer>
                <div>{entry.name}</div>
                {secondaryColumn && secondaryColumn(entry)}
              </ItemContainer>
            </Item>
          )} />
      </Spin>
      <Modal centered maskClosable 
        title={modalTitle}
        visible={modal !== null} 
        onCancel={() => setModal(null)}
        footer={null}
        width={600} 
        bodyStyle={ModalStyles}>
        <HandledForm 
          collectionName={collectionName}
          form={form}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          id={modalHasId ? modal.id : undefined} />
      </Modal>
    </Container>
  );
});

export default ListTemplate;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;

  > div:first-of-type {
    display: flex;
    flex-direction: column;
    align-items: end;

    > div:first-child {
      margin-bottom: 10px;
    }
  }
`;

const ItemContainer = styled.div`
  display: flex;

  > div:first-of-type {
    width: 20vw;
  }
`;

interface ITemplateProps extends ISharedProps {
  secondaryColumn?: (entry: any) => React.ReactNode
  form: FormPropType
}
