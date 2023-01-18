import { FC, CSSProperties } from 'react';
import styled from 'styled-components';
import { Typography, Table, Input, Button, Modal, Space, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import useTemplateHandlers, { IData } from '../abstracts/useTemplateHandlers';
import FallbackView, { ViewPropType } from './FallbackView';
import FallbackForm, { FormPropType } from "./FallbackForm";

const { Text } = Typography;
const { Search } = Input;

// TODO: Pagination and add table height limit.

const TableTemplate: FC<ITemplateProps> = props => {
  const { collectionName, searchBy, columns, view, form, modalWidth } = props;
  const { data, modal, setSearch, setModal, getFormTitle, handlers } = useTemplateHandlers(collectionName, searchBy);
  const { handleAdd, handleEdit, handleDelete } = handlers;
  const modalHasId = (modal !== null && 'id' in modal);

  return (
    <Container>
      <Search allowClear 
        placeholder="Cari" 
        style={{ width: 250 }} 
        onSearch={val => setSearch(val)} />
      <div>
        <Text>Menemukan {data?.length} hasil.</Text>
        <Button 
          icon={<PlusOutlined />} 
          onClick={() => setModal({ mode: 'add' })}>
          New
        </Button>
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
        title={getFormTitle()}
        visible={modal !== null} 
        onCancel={() => setModal(null)}
        footer={null}
        width={modalWidth ?? 600} 
        bodyStyle={ModalStyles}>
        {modalHasId && modal.mode === 'view' ? (
          <FallbackView
            id={modal.id}   // Use the 'columns' prop instead to build the view if not provided.
            collectionName={collectionName}
            view={view ?? columns.map((item: any) => ({ key: item.dataIndex, label: item.title }))} />
        ) : (
          <FallbackForm
            id={modalHasId ? modal.id : undefined}
            collectionName={collectionName}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
            form={form} />
        )}
      </Modal>
    </Container>
  );
}

export default TableTemplate;

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
  justifyContent: 'center',
  maxHeight: '80vh',
  overflowY: 'scroll'
};

interface ITemplateProps {
  collectionName: string
  searchBy: string
  columns: ColumnsType<IData>
  view: ViewPropType
  form: FormPropType
  modalWidth?: number
}

type ClickHandler1 = React.MouseEventHandler<HTMLElement>;
type ClickHandler2 = ((e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void) | undefined;
