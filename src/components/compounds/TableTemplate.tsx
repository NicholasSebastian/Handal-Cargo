import { CSSProperties, ReactNode, createContext, useContext } from 'react';
import styled from 'styled-components';
import { Typography, Table, Button, Modal, Space, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import withTemplateHandling, { ISharedProps, IData, ModalState } from '../abstractions/withTemplateHandling';
import FallbackView, { ViewPropType } from './FallbackView';
import FallbackForm, { FormPropType } from "./FallbackForm";
import Search from '../basics/Search';

const { Text } = Typography;
const ModalContext = createContext<ModalControl>(undefined);
const useModal = () => useContext(ModalContext);

// TODO: Sorter.
// TODO: Fixed header.
// TODO: Pagination.

const TableTemplate = withTemplateHandling<ITemplateProps>(props => {
  const { 
    collectionName, columns, view, form, extra, 
    width, modalWidth, data, loading, modalTitle, searchKey, modal, 
    showIndicator, setSearch, setSearchKey, setModal, handlers 
  } = props;
  const { handleAdd, handleEdit, handleDelete } = handlers;
  const modalHasId = (modal !== null && 'id' in modal);

  return (
    <Container>
      <Search 
        onSearch={setSearch} 
        searchBy={searchKey}
        setSearchBy={setSearchKey} 
        columns={columns} />
      <div>
        {extra ?? <Text>Menampilkan {data?.length ?? '?'} hasil.</Text>}
        <Button 
          icon={<PlusOutlined />} 
          onClick={() => setModal({ mode: 'add' })}>
          Baru
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
            width: 155,
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
                    <Button onClick={e => e.stopPropagation()}>Hapus</Button>
                  </Popconfirm>
                </Space>
              );
            }
          }
        ]} />
      <Modal centered maskClosable 
        title={modalTitle}
        visible={modal !== null} 
        onCancel={() => setModal(null)}
        footer={null}
        width={modalWidth ?? 650} 
        bodyStyle={ModalStyles}>
        <ModalContext.Provider value={setModal}>
          {(modalHasId && modal.mode === 'view') ? (
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
        </ModalContext.Provider>
      </Modal>
    </Container>
  );
});

export { ModalStyles, useModal };
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

interface ITemplateProps extends ISharedProps {
  columns: ColumnsType<IData>
  view: ViewPropType
  form: FormPropType
  extra?: ReactNode
  width?: number
  modalWidth?: number
  showIndicator?: (entry: any) => boolean
}

type ClickHandler1 = React.MouseEventHandler<HTMLElement>;
type ClickHandler2 = ((e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void) | undefined;
type ModalControl = React.Dispatch<React.SetStateAction<ModalState>> | undefined;
