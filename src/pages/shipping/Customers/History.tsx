import { BSON } from "realm-web";
import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import useDatabase from "../../../data/useDatabase";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import Search from "../../../components/basics/Search";
import pipeline from "./history-aggregation";
import { dateToString, formatCurrency } from "../../../utils";

function formatLocalCurrency(value: any) {
  return DEFAULT_SYMBOL + formatCurrency(value ?? 0);
}

function formatForeignCurrency(value: any, record: Record<string, any>) {
  return DEFAULT_SYMBOL + formatCurrency((value * record.exchange_rate) || 0);
}

const CustomerHistory: FC<IPageProps> = props => {
  const { id } = props;
  const database = useDatabase();

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<RegExp>();
  const [searchKey, setSearchKey] = useState('marking');
  
  useEffect(() => {
    setLoading(true);
    database?.collection('Customers')
      .aggregate(search ? [...pipeline(id), { $match: { [searchKey]: search } }] : pipeline(id))
      .then(results => setData(results))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <HistoryContainer>
      <Search
        onSearch={setSearch}
        searchOptions={[
          { key: 'marking', label: 'Marking' },
          { key: 'container_number', label: 'Nomor Container' },
          { key: 'airwaybill_number', label: 'Nomor Air Waybill' },
          { key: 'item_code', label: 'Kode Barang' },
          { key: 'description', label: 'Keterangan' }
        ]}
        searchBy={searchKey}
        setSearchBy={setSearchKey} />
      <Table bordered
        size="small"
        pagination={false}
        scroll={{ x: 2400 }}
        dataSource={data}
        loading={loading}
        columns={[
          { dataIndex: 'muat_date', title: 'Tanggal Muat', render: dateToString, width: 190 },
          { dataIndex: 'arrival_date', title: 'Tanggal Tiba', render: dateToString, width: 190 },
          { dataIndex: 'payment_id', title: 'Kode Pembayaran', render: value => value?.toString() ?? 'Belum Dibayar', width: 210 },
          { dataIndex: 'container_number', title: 'Nomor Container', render: value => value ?? 'N/A', width: 140 },
          { dataIndex: 'airwaybill_number', title: 'Nomor Air Waybill', render: value => value ?? 'N/A', width: 140 },
          { dataIndex: 'item_code', title: 'Kode Barang', render: value => value ?? 'N/A', width: 140 },
          { dataIndex: 'marking', title: 'Marking', width: 80 },
          { dataIndex: 'quantity', title: 'Kuantitas', width: 80 },
          { dataIndex: 'measurement', title: 'Ukuran', render: (value, { measurement_option }) => `${value} ${measurement_option}`, width: 120 },
          { dataIndex: 'price', title: 'Harga', render: formatForeignCurrency, width: 130 },
          { dataIndex: 'volume_charge', title: 'Harga Cas Volume', render: formatForeignCurrency, width: 135 },
          { dataIndex: 'shipment_fee', title: 'Ongkir Kirim', render: formatForeignCurrency, width: 130 },
          { dataIndex: 'additional_fee', title: 'Biaya Tambahan', render: formatForeignCurrency, width: 130 },
          { dataIndex: 'other_fee', title: 'Biaya Lain-Lain', render: formatLocalCurrency, width: 130 },
          { dataIndex: 'discount', title: 'Diskon', render: formatLocalCurrency, width: 130 },
          { dataIndex: 'total', title: 'Total', render: formatLocalCurrency, width: 130 },
          { dataIndex: 'description', title: 'Keterangan' }
        ]} />
    </HistoryContainer>
  );
}

export default CustomerHistory;

const HistoryContainer = styled.div`
  width: 100%;
  
  > div:first-child {
    margin-bottom: 20px;
    float: right;
  }
`;

interface IPageProps {
  id: BSON.ObjectId
}
