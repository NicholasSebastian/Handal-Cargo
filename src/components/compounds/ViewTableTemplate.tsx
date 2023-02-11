import { FC, ReactNode, useState } from "react";
import styled from "styled-components";
import { Table, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import { ModalStyles } from "./TableTemplate";
import BasicView, { IViewItem } from "../basics/BasicView";
import Search from "../basics/Search";
import useDataFetching from "../abstractions/useDataFetching";

const BasicTableTemplate: FC<ITemplateProps> = props => {
  const { title, collection, columns, viewItems, viewExtra, extra } = props;
  const initSearchKey = (columns[0] as any).dataIndex;
  const { data, loading, searchKey, setSearch, setSearchKey } = useDataFetching(collection, initSearchKey);
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
        dataSource={data}
        loading={loading}
        onRow={entry => ({ onClick: () => setModal(entry) })}
        columns={columns} />
      <Modal centered maskClosable
        title={title}
        visible={modal}
        onCancel={() => setModal(undefined)}
        footer={null}
        width={650}
        bodyStyle={ModalStyles}>
        <BasicView
          values={modal}
          viewItems={viewItems} />
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
  title: string
  collection: string
  columns: ColumnsType<any>
  viewItems: Array<IViewItem>
  viewExtra?: (values: Record<string, any>) => ReactNode
  extra?: ReactNode
}
