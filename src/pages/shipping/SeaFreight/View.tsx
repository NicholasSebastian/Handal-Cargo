import { FC, useState } from "react";
import styled from "styled-components";
import { Table, Space, Descriptions, Button, Tooltip } from "antd";
import { FileDoneOutlined, AuditOutlined } from "@ant-design/icons";
import { IInjectedProps } from "../../../components/abstractions/withInitialData";
import { dateToString, formatCurrency } from "../../../utils";
import print from "../../../print";
import { columns } from "./MarkingTable";
import TravelDocumentForm from "./TravelDocument/Form";
import InvoiceForm from "./Invoice/Form";

const { Item } = Descriptions;

const SeaFreightView: FC<IInjectedProps> = props => {
  const { markings, ...values } = props.values;
  const [currentPage, setCurrentPage] = useState<PageState>('default');

  if (currentPage !== 'default') {
    const markingValues = { ...values, ...currentPage.marking };
    const formProps = { values: markingValues, setCurrentPage };

    switch (currentPage.type) {
      case 'travel_document':
        return <TravelDocumentForm {...formProps} />

      case 'invoice':
        return <InvoiceForm {...formProps} />
    }
  }
  return (
    <ViewContainer>
      <Descriptions
        column={2}
        labelStyle={{ fontWeight: 500 }}>
        <Item label="Nomor Container">{values.container_number}</Item>
        <Item label="Tanggal Muat">{dateToString(values.muat_date)}</Item>
        <Item label="Tanggal Tiba">{dateToString(values.arrival_date)}</Item>
        <Item label="Tanggal BL">{dateToString(values.bl_date)}</Item>
        <Item label="Kelompok Container">{values.container_group}</Item>
        <Item label="Shipper">{values.carrier}</Item>
        <Item label="Rute">{values.route}</Item>
        <Item label="Pengurus">{values.handler}</Item>
        <Item label="Keterangan">{values.description}</Item>
        <Item label="Mata Uang">{values.currency}</Item>
        <Item label="Kurs">{`Rp.${formatCurrency(values.exchange_rate)} / ${values.currency}`}</Item>
        <Item label="Biaya Custom Clearance">{'Rp.' + formatCurrency(values.clearance_fee * values.exchange_rate)}</Item>
        <Item label="Biaya Muat">{'Rp.' + formatCurrency(values.muat_fee * values.exchange_rate)}</Item>
        <Item label="Biaya Tambahan">{'Rp.' + formatCurrency(values.additional_fee * values.exchange_rate)}</Item>
        <Item label="Biaya Lain-Lain">{'Rp.' + formatCurrency(values.other_fee * values.exchange_rate)}</Item>
      </Descriptions>
      <Table bordered
        size="small"
        scroll={{ x: 1280 }}
        pagination={false}
        dataSource={markings}
        columns={[
          ...columns,
          {
            fixed: 'right',
            width: 90,
            render: (_, marking) => (
              <Space>
                <Tooltip 
                  title="Buat Surat Jalan" 
                  placement="left">
                  <Button 
                    icon={<FileDoneOutlined />}
                    onClick={() => setCurrentPage({ type: 'travel_document', marking })} />
                </Tooltip>
                <Tooltip 
                  title="Buat Faktur" 
                  placement="right">
                  <Button 
                    icon={<AuditOutlined />}
                    onClick={() => setCurrentPage({ type: 'invoice', marking })} />
                </Tooltip>
              </Space>
            )
          }
        ]} />
      <div>
        <Button onClick={() => print(markings, 'sf-rugi-laba')}>
          Laporan Rugi Laba
        </Button>
      </div>
    </ViewContainer>
  );
}

export type { IFormProps };
export default SeaFreightView;

const ViewContainer = styled.div`
  width: calc(100% - 100px);

  > div.ant-table-wrapper {
    margin-top: 10px;
  }

  > div:last-child {
    padding-bottom: 100px;
    
    > button {
      margin-top: 25px;
      float: right;
    }
  }
`;

interface IFormProps extends IInjectedProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>
}

interface IAltPageState {
  type: 'travel_document' | 'invoice'
  marking: any
}

type PageState = 'default' | IAltPageState;
