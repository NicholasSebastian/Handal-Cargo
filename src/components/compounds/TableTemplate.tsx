import { FC, CSSProperties } from 'react';
import styled from 'styled-components';
import { Typography, Table, Button, Modal, Space, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import useTemplateHandlers, { IData, Query } from '../abstractions/useTemplateHandling';
import FallbackView, { ViewPropType } from './FallbackView';
import FallbackForm, { FormPropType } from "./FallbackForm";
import Search from '../basics/Search';

const { Text } = Typography;

// TODO: Sorter.
// TODO: Fixed header.
// TODO: Pagination.

const TableTemplate: FC<ITemplateProps> = props => {
  const { collectionName, columns, view, form, width, modalWidth, defaultSearchBy, query, showIndicator } = props;
  const initialSearchBy = defaultSearchBy ?? (columns[0] as any).dataIndex;
  const { data, loading, searchBy, modal, setSearch, setSearchBy, setModal, getFormTitle, handlers } = useTemplateHandlers(collectionName, initialSearchBy, query);
  const { handleAdd, handleEdit, handleDelete } = handlers;
  const modalHasId = (modal !== null && 'id' in modal);

  return (
    <Container>
      <Search 
        onSearch={setSearch} 
        searchBy={searchBy}
        setSearchBy={setSearchBy} 
        columns={columns} />
      <div>
        <Text>Menampilkan {data?.length} hasil.</Text>
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
        loading={loading} 
        scroll={width ? { x: width } : undefined}
        onRow={entry => ({ 
          onClick: () => setModal({ mode: 'view', id: entry._id }),
          className: (showIndicator && showIndicator(entry)) ? 'badge' : undefined
        })}
        columns={[
          ...columns.map(column => {
            column.ellipsis = true;
            return column;
          }), 
          {
            fixed: 'right',
            width: 150,
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
          }
        ]} />
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

export { ModalStyles };
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

  // Indicator syles.
  tbody > tr.badge > td:first-child::after {
    content: '';
    background-color: #52c41a;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    position: absolute;
    top: -8px;
    left: -8px;
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
  columns: ColumnsType<IData>
  view: ViewPropType
  form: FormPropType
  width?: number
  modalWidth?: number
  defaultSearchBy?: string
  query?: Query
  showIndicator?: (entry: any) => boolean
}

type ClickHandler1 = React.MouseEventHandler<HTMLElement>;
type ClickHandler2 = ((e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void) | undefined;
