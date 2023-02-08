import { FC, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Table, Button, Space } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import useDatabase from "../../../../data/useDatabase";
import Search from "../../../../components/basics/Search";
import print from "../../../../print";
import { IPageProps } from "../index";

// TODO: Add a Surat Jalan table to view all Surat Jalan, including an Advanced Search feature, 
//       whether it gets its own page, or just a modal accessible through this page.
// TODO: The items on the table should be clickable to view their details, alongside the 'Print' button.
// TODO: The table should have 'Print SJ' and 'Print SJ Daerah' buttons on the right for each row.

const columns = [
  { dataIndex: 'marking', title: 'Marking' },
  { dataIndex: 'container_number', title: 'Nomor Container' },
  { dataIndex: 'carrier', title: 'Shipper' },
  { dataIndex: 'quantity', title: 'Kuantitas Kirim' }
];

const TravelDocument: FC<IPageProps> = props => {
  const { goBack } = props;
  const database = useDatabase();

  const [data, setData] = useState<Array<any>>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<RegExp>();
  const [searchKey, setSearchKey] = useState('marking');

  const fetchData = useCallback(() => {
    if (!search) 
      return database?.collection('TravelPermits').find();
    else 
      return database?.collection('TravelPermits').find({ 
        [searchKey]: { $regex: search, $options: 'i' } 
      });
  }, [search, searchKey]);

  const refreshData = useCallback(() => {
    setLoading(true);
    fetchData()
      ?.then(results => {
        if (results) setData(results);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(refreshData, []);
  return (
    <Container>
      <div>
        <Button 
          icon={<LeftOutlined />} 
          onClick={goBack}>
          Kembali
        </Button>
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
        columns={[
          ...columns,
          {
            fixed: 'right',
            render: (_, entry) => (
              <Space>
                <Button onClick={() => print(entry, 'sf-surat-jalan')}>
                  Print SJ Lagi
                </Button>
                <Button onClick={() => print(entry, 'sf-surat-jalan-daerah')}>
                  Print SJ Daerah Lagi
                </Button>
              </Space>
            )
          }
        ]} />
    </Container>
  );
}

export default TravelDocument;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;

  > div:first-child {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
`;
