import { BSON } from 'realm-web';
import { CSSProperties, ReactNode, ComponentType, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { Typography, Table, Button, Modal, Space, Popconfirm, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { PlusOutlined } from '@ant-design/icons';
import withTemplateHandling, { ISharedProps, IData } from '../abstractions/withTemplateHandling';
import withInitialData, { IInjectedProps as InjectedViewProps } from '../abstractions/withInitialData';
import withFormHandling, { IInjectedProps as InjectedFormProps } from '../abstractions/withFormHandling';
import withFallback from '../abstractions/withFallback';
import BasicView, { IViewProps, IViewItem } from '../basics/BasicView';
import BasicForm, { IFormProps, FormItem } from '../basics/BasicForm';
import Search, { columnsToOptions } from '../basics/Search';
import { Subtract } from '../../utils';

const { Text } = Typography;

const TableTemplate = withTemplateHandling<ITemplateProps>(props => {
  const { 
    collectionName, columns, view, form, extra, itemQuery, deleteCheck,
    width, modalWidth, data, loading, modalTitle, searchKey, modal, 
    showIndicator, setSearch, setSearchKey, setModal, excludeFromSearch, handlers 
  } = props;

  const { handleAdd, handleEdit, handleDelete } = handlers;
  const searchOptions = useMemo(() => columnsToOptions(columns)
    .filter(column => !excludeFromSearch?.includes(column.key)), []);
  
  const FallbackView = withFallback(view, BasicView);
  const FallbackForm = withFallback(form, BasicForm);

  const HandledView = withInitialData(FallbackView, itemQuery);
  const HandledForm = withFormHandling(FallbackForm, itemQuery);

  return (
    <Container>
      <Search 
        onSearch={setSearch} 
        searchBy={searchKey}
        setSearchBy={setSearchKey} 
        searchOptions={searchOptions} />
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
            width: 152,
            render: entry => {
              const onEdit: ClickHandler1 = e => {
                e.stopPropagation(); 
                setModal({ mode: 'edit', id: entry._id });
              };
              const onDelete: ClickHandler2 = e => {
                e?.stopPropagation(); 
                if (deleteCheck) 
                  deleteCheck(entry._id, entry).then(allowed => {
                    if (allowed) 
                      handleDelete(entry._id);
                    else 
                      message.error("Data ini tidak boleh dihapus.");
                  });
                else 
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
        visible={modal != null} 
        onCancel={() => setModal(null)}
        footer={null}
        width={modalWidth ?? 650} 
        bodyStyle={ModalStyles}>
        {(modal != null) && (
          (modal.mode === 'view') ? (
            <HandledView
              key={Date.now()}
              id={modal.id}
              collectionName={collectionName}
              view={view ?? columns.map((item: any) => ({ key: item.dataIndex, label: item.title }))} />
          ) : (
            <HandledForm
              key={Date.now()}
              id={('id' in modal) ? modal.id : undefined}
              collectionName={collectionName}
              handleAdd={handleAdd}
              handleEdit={handleEdit} />
          )
        )}
      </Modal>
    </Container>
  );
});

export { ModalStyles, enableIndicator };
export type { HandledViewProps, HandledFormProps, ViewPropType, FormPropType };
export default TableTemplate;

const enableIndicator = css`
  tbody > tr.badge > td:first-child::after {
    content: '';
    background-color: #52c41a;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    position: absolute;
    top: -8px;
    left: -8px;
    clip-path: inset(50% 0 0 50%);
  }
`;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  text-align: right;

  ${enableIndicator}
  
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
  flexDirection: 'column',
  alignItems: 'center',
  maxHeight: '80vh',
  overflowY: 'scroll'
};

interface ITemplateProps extends ISharedProps {
  columns: ColumnsType<IData>
  view: ViewPropType;
  form: FormPropType;
  extra?: ReactNode
  width?: number
  modalWidth?: number
  showIndicator?: (entry: any) => boolean
  excludeFromSearch?: Array<string>
  deleteCheck?: (id: BSON.ObjectId, record: any) => Promise<boolean>
}

type ViewPropType = ComponentType<InjectedViewProps> | Array<IViewItem> | HandledViewProps;
type FormPropType = ComponentType<InjectedFormProps> | Array<FormItem> | HandledFormProps;
type HandledViewProps = Subtract<IViewProps, InjectedViewProps>;
type HandledFormProps = Subtract<IFormProps, InjectedFormProps>;
type ClickHandler1 = React.MouseEventHandler<HTMLElement>;
type ClickHandler2 = ((e?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void) | undefined;
