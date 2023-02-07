import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Table, Space, Descriptions, Button, Tooltip, message } from "antd";
import { CheckOutlined, CloseOutlined, FileDoneOutlined, AuditOutlined } from "@ant-design/icons";
import { useTitle } from "../../../components/abstractions/withTemplateHandling";
import { IInjectedProps } from "../../../components/abstractions/withInitialData";
import { dateToString, formatCurrency } from "../../../utils";
import TravelDocumentForm from "./TravelDocument/Form";
import InvoiceForm from "./Invoice/Form";

const { Item } = Descriptions;
const check = <CheckOutlined style={{ color: 'green' }} />
const cross = <CloseOutlined style={{ color: 'red' }} />

// TODO: The Laporan Rugi Laba print preview page. (Idk, you gotta ask Ifat for clarification)

const SeaFreightView: FC<IInjectedProps> = props => {
  const { markings, ...values } = props.values;
  const [currentPage, setCurrentPage] = useState<PageState>('default');
  const setTitle = useTitle(); // TODO: Fix this causing weirdass blinking issues.

  if (currentPage !== 'default') {
    const markingValues = { ...values, ...currentPage.marking };
    const formProps = { values: markingValues, setCurrentPage };

    switch (currentPage.type) {
      case 'travel_document':
        setTitle!("Surat Jalan Baru untuk Sea Freight");
        return <TravelDocumentForm {...formProps} />

      case 'invoice':
        setTitle!("Faktur Baru untuk Sea Freight");
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
          { dataIndex: 'marking', title: 'Marking' },
          { dataIndex: 'quantity', title: 'Kuantitas' },
          { dataIndex: 'listm3', title: 'List (m³)', render: value => value && (value + ' m³') },
          { dataIndex: 'listkg', title: 'List (kg)', render: value => value && (value + ' kg') },
          { dataIndex: 'dlistm3', title: 'DList (m³)', render: value => value && (value + ' m³') },
          { dataIndex: 'dlistkg', title: 'DList (kg)', render: value => value && (value + ' kg') },
          { dataIndex: 'hbm3', title: 'HB (m³)', render: value => value && (value + ' m³') },
          { dataIndex: 'hbkg', title: 'HB (kg)', render: value => value && (value + ' kg') },
          { dataIndex: 'custm3', title: 'Cust (m³)', render: value => value && (value + ' m³') },
          { dataIndex: 'custkg', title: 'Cust (kg)', render: value => value && (value + ' kg') },
          { dataIndex: 'paid', title: 'Lunas', render: value => value ? check : cross },
          { dataIndex: 'remainder', title: 'Sisa' },
          { dataIndex: 'travel_documents', title: 'Surat Jalan', width: 100 },
          { dataIndex: 'invoices', title: 'Faktur' },
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
        <Button 
          onClick={() => message.warning("Fitur ini masih Work in Progress.")}>
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
