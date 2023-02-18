import { FC, ReactNode, useState } from "react";
import styled from "styled-components";
import { Table, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import useRoute from "../../data/useRoute";
import useDataFetching, { Query } from "../abstractions/useDataFetching";
import { ModalStyles, enableIndicator } from "./TableTemplate";
import BasicView, { IViewItem } from "../basics/BasicView";
import Search from "../basics/Search";

const BasicTableTemplate: FC<ITemplateProps> = props => {
  const { title, collectionName, columns, width, modalWidth, viewItems, viewExtra, extra, columnExtra, query, showIndicator } = props;
  const { title: defaultTitle } = useRoute()!;
  const initSearchKey = (columns[0] as any).dataIndex;
  const { data, loading, searchKey, setSearch, setSearchKey, refreshData } = useDataFetching(collectionName, initSearchKey, query);

  const [modal, setModal] = useState<any>();
  const closeModal = () => setModal(undefined);

  return (
    <Container>
      <div>
        {extra ?? <div />}
        <Search 
          onSearch={setSearch}
          searchBy={searchKey}
          setSearchBy={setSearchKey} 
          columns={columns} />
      </div>
      <Table
        size="small"
        pagination={false}
        scroll={width ? { x: width } : undefined}
        dataSource={data}
        loading={loading}
        onRow={entry => ({ 
          onClick: () => setModal(entry),
          className: (showIndicator && showIndicator(entry)) ? 'badge' : undefined 
        })}
        columns={columnExtra ? [...columns, { fixed: 'right', width: 92, render: item => columnExtra(item, refreshData) }] : columns} />
      <Modal centered maskClosable
        title={title ?? defaultTitle}
        visible={modal}
        onCancel={closeModal}
        footer={null}
        width={modalWidth ?? 650}
        bodyStyle={ModalStyles}>
        <BasicView
          values={modal}
          items={(typeof viewItems === 'function') ? viewItems(modal) : viewItems} />
        {viewExtra && viewExtra(modal, closeModal, refreshData)}
      </Modal>
    </Container>
  );
}

export default BasicTableTemplate;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;

  ${enableIndicator}

  > div:first-child {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  tbody > tr:hover {
    cursor: pointer;
  }
`;

interface ITemplateProps {
  collectionName: string
  query?: Query
  title?: string
  extra?: ReactNode
  columns: ColumnsType<any>
  columnExtra?: (values: Record<string, any>, refresh: Fn) => ReactNode
  viewItems: Array<IViewItem> | ((values: Record<string, any>) => Array<IViewItem>)
  viewExtra?: (values: Record<string, any>, closeModal: Fn, refresh: Fn) => ReactNode
  width?: number
  modalWidth?: number
  showIndicator?: (entry: any) => boolean
}

type Fn = () => void;
