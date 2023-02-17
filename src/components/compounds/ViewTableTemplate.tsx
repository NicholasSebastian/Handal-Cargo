import { FC, ReactNode, useState } from "react";
import styled from "styled-components";
import { Table, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import { ModalStyles } from "./TableTemplate";
import BasicView, { IViewItem } from "../basics/BasicView";
import Search from "../basics/Search";
import useDataFetching, { Query } from "../abstractions/useDataFetching";
import useRoute from "../../data/useRoute";

const BasicTableTemplate: FC<ITemplateProps> = props => {
  const { title, collectionName, columns, width, modalWidth, viewItems, viewExtra, extra, columnExtra, query } = props;
  const { title: defaultTitle } = useRoute()!;
  const initSearchKey = (columns[0] as any).dataIndex;
  const { data, loading, searchKey, setSearch, setSearchKey, refreshData } = useDataFetching(collectionName, initSearchKey, query);
  const [modal, setModal] = useState<any>();

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
        onRow={entry => ({ onClick: () => setModal(entry) })}
        columns={columnExtra ? [...columns, { fixed: 'right', width: 92, render: item => columnExtra(item, refreshData) }] : columns} />
      <Modal centered maskClosable
        title={title ?? defaultTitle}
        visible={modal}
        onCancel={() => setModal(undefined)}
        footer={null}
        width={modalWidth ?? 650}
        bodyStyle={ModalStyles}>
        <BasicView
          values={modal}
          items={viewItems} />
        {viewExtra && viewExtra(modal)}
      </Modal>
    </Container>
  );
}

export default BasicTableTemplate;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;

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
  columnExtra?: (values: Record<string, any>, refresh: () => void) => ReactNode
  viewItems: Array<IViewItem>
  viewExtra?: (values: Record<string, any>) => ReactNode
  width?: number
  modalWidth?: number
}
