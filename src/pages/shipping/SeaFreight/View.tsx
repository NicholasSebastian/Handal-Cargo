import { FC, Fragment, useState } from "react";
import { Table, Space, Button, Tooltip } from "antd";
import { FileDoneOutlined, AuditOutlined } from "@ant-design/icons";
import BasicView, { gap } from "../../../components/basics/BasicView";
import { IInjectedProps } from "../../../components/abstractions/withInitialData";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import { columns } from "./MarkingTable";
import TravelDocumentForm from "./TravelDocument/Form";
import InvoiceForm from "./Invoice/Form";
import print from "../../../print";
import { dateToString, formatCurrency } from "../../../utils";

function formatForeignCurrency(value: any, record: Record<string, any>) {
  const { exchange_rate } = record;
  return DEFAULT_SYMBOL + formatCurrency(value * exchange_rate);
}

function calculateTotal(record: Record<string, any>) {
  const { muat_fee, additional_fee, clearance_fee, other_fee, exchange_rate } = record;
  const value = ((muat_fee + additional_fee + clearance_fee) * exchange_rate) + other_fee;
  return DEFAULT_SYMBOL + formatCurrency(value.toString());
}

const SeaFreightView: FC<IInjectedProps> = props => {
  const { markings, ...values } = props.values;
  const [currentPage, setCurrentPage] = useState<PageState>('default');

  if (currentPage !== 'default') {
    const markingValues = { ...values, ...currentPage.marking };
    const formProps: IFormProps = { values: markingValues, setCurrentPage };

    switch (currentPage.type) {
      case 'travel_document':
        return <TravelDocumentForm {...formProps} />

      case 'invoice':
        return <InvoiceForm {...formProps} />
    }
  }
  return (
    <BasicView
      values={values}
      items={[
        { key: 'container_number', label: 'Nomor Container' },
        { key: 'muat_date', label: 'Tanggal Muat', render: dateToString },
        { key: 'container_group', label: 'Kelompok Container' },
        { key: 'arrival_date', label: 'Tanggal Tiba', render: dateToString },
        { key: 'carrier', label: 'Shipper' },
        { key: 'bl_date', label: 'Tanggal BL', render: dateToString },
        { key: 'route', label: 'Rute' },
        { key: 'currency', label: 'Mata Uang' },
        { key: 'handler', label: 'Pengurus' },
        { key: 'exchange_rate', label: 'Kurs', render: (value, record) => `${DEFAULT_SYMBOL}${formatCurrency(value)} / ${record.currency}` },
        { key: 'muat_fee', label: 'Biaya Muat', render: formatForeignCurrency },
        { key: 'additional_fee', label: 'Biaya Tambahan', render: formatForeignCurrency },
        { key: 'clearance_fee', label: 'Biaya Custom Clearance', render: formatForeignCurrency },
        { key: 'other_fee', label: 'Biaya Lain-Lain', render: value => DEFAULT_SYMBOL + formatCurrency(value) },
        gap,
        { label: 'Total Biaya', render: (_, record) => calculateTotal(record) },
        gap,
        { key: 'description', label: 'Keterangan' }
      ]}
      extra={
        <Fragment>
          <Table bordered
            size="small"
            scroll={{ x: 1280 }}
            style={{ marginTop: '20px' }}
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
            <Button 
              onClick={() => print(markings, 'sf-rugi-laba')}
              style={{ marginTop: '25px', float: 'right' }}>
              Laporan Rugi Laba
            </Button>
          </div>
        </Fragment>
      } />
  );
}

export type { IFormProps };
export default SeaFreightView;

interface IFormProps extends IInjectedProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>
}

interface IAltPageState {
  type: 'travel_document' | 'invoice'
  marking: any
}

type PageState = 'default' | IAltPageState;
