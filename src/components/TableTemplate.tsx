import { FC, ComponentType, CSSProperties, useId } from 'react';
import styled from 'styled-components';
import { Typography, Table, Input, Button, Modal, Space, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import useRoute from "../data/useRoute";
import withDataHandlers, { IHandledProps, IData } from './withDataHandlers';
import withViewHandling from './withViewHandling';
import withFormHandling, { IInjectedProps as IFormProps } from "./withFormHandling";
import BasicView, { IViewItem } from './BasicView';

const { Text } = Typography;
const { Search } = Input;

// TODO: Pagination and add table height limit. 

const TableTemplate: FC<ITemplateProps> = props => {
  const { collectionName, columns, viewItems, form, modalWidth } = props;
  const { title } = useRoute()!;
  const ViewComponent = withViewHandling(BasicView);
  const FormComponent = withFormHandling(form);

  // From the 'withDataHandlers' higher-order function.
  const { data, modal, handleAdd, handleEdit, handleDelete, setSearch, setModal } = props;
  const modalHasId = (modal !== null && modal.mode !== 'add');

  // The title of the modal will be rendered depending on the current modal state.
  const renderTitle = () => {
    if (modalHasId) {
      if (modal.mode === 'edit') return 'Edit ' + title;
      return title;
    }
    return 'New ' + title;
  }

  return (
    <Container>
      <Search allowClear 
        placeholder="Cari" 
        style={{ width: 250 }} 
        onSearch={val => setSearch(val)} />
      <div>
        <Text>Menemukan {data?.length} hasil.</Text>
        <Button icon={<PlusOutlined />} onClick={() => setModal({ mode: 'add' })}>New</Button>
      </div>
      <Table 
        size='small' 
        pagination={false}
        dataSource={data}
        onRow={entry => ({ 
          onClick: () => setModal({ mode: 'view', id: entry._id }) 
        })}
        columns={[...columns, {
          render: entry => {
            const onEdit: ClickHandler1 = e => {
              e.stopPropagation(); 
              setModal({ mode: 'edit', id: entry._id });
            };
            const onDelete: ClickHandler2 = e => {
              e?.stopPropagation(); 
              handleDelete(entry._id);
            }
            return (
              <Space>
                <Button onClick={onEdit}>Edit</Button>
                <Popconfirm 
                  title="Yakin di hapus?" 
                  placement="left"
                  onCancel={e => e?.stopPropagation()}
                  onConfirm={onDelete}>
                  <Button onClick={e => e.stopPropagation()}>Delete</Button>
                </Popconfirm>
              </Space>
            );
          }
        }]} />
      <Modal centered maskClosable 
        title={renderTitle()}
        visible={modal !== null} 
        onCancel={() => setModal(null)}
        footer={null}
        width={modalWidth ?? 600} 
        bodyStyle={ModalStyles}>
        {modalHasId && modal.mode === 'view' ? (
          <ViewComponent
            key={useId()}
            collectionName={collectionName}
            id={modal.id}   // Use the 'columns' prop instead to build the view if not provided.
            viewItems={viewItems ?? columns.map((item: any) => ({ key: item.dataIndex, label: item.title }))} />
        ) : (
          <FormComponent
            key={modalHasId ? modal.id.toString() : useId()}
            collectionName={collectionName}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
            id={modalHasId ? modal.id : undefined} />
        )}
      </Modal>
    </Container>
  );
}

export default withDataHandlers(TableTemplate);

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  text-align: right;
  
  > div:nth-child(2) {
    display: flex;
    justify-content: space-between;
    align-items: end;
    margin: 10px 0;

    > span {
      font-size: 12px;
    }
  }

  tbody > tr:hover {
    cursor: pointer;
  }
`;

const ModalStyles: CSSProperties = { 
  padding: '30px 0', 
  display: 'flex', 
  justifyContent: 'center' 
};

interface ITemplateProps extends IHandledProps {
  columns: ColumnsType<IData>
  viewItems?: Array<IViewItem>
  form: ComponentType<IFormProps>
  modalWidth?: number
}

type ClickHandler1 = React.MouseEventHandler<HTMLElement>;
type ClickHandler2 = ((e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void) | undefined;
