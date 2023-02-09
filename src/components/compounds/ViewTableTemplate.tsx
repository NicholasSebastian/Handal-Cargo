import { FC, ReactNode, ComponentType, useState, useEffect } from "react";
import styled from "styled-components";
import { Table, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import useDatabase from "../../data/useDatabase";
import { ModalStyles } from "./TableTemplate";
import BasicView, { IViewItem } from "../basics/BasicView";
import Search from "../basics/Search";

const BasicTableTemplate: FC<ITemplateProps> = props => {
  const { title, collection, columns, viewItems, viewExtra, extra } = props;
  const database = useDatabase();

  const [data, setData] = useState<Array<any>>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<RegExp>();
  const [searchKey, setSearchKey] = useState((columns[0] as any).dataIndex);
  const [modal, setModal] = useState<any>();

  const fetchData = () => {
    if (!search) 
      return database?.collection(collection).find();
    else 
      return database?.collection(collection).find({ 
        [searchKey]: { $regex: search, $options: 'i' } 
      });
  };

  const refreshData = () => {
    setLoading(true);
    fetchData()
      ?.then(results => {
        if (results) setData(results);
      })
      .finally(() => setLoading(false));
  };

  useEffect(refreshData, []);
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
