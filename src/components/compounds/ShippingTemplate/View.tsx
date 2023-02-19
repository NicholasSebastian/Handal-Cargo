import { ComponentType, FC, Fragment, useState } from "react";
import { Table, Space, Button, Tooltip, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FileDoneOutlined, AuditOutlined } from "@ant-design/icons";
import useRoute from "../../../data/useRoute";
import { IInjectedProps } from "../../abstractions/withInitialData";
import BasicView, { IViewItem } from "../../basics/BasicView";
import print, { Presets } from "../../../print";

const View: FC<IViewProps> = props => {
  const { items, columns, TravelDocumentForm, InvoiceForm, printPreset } = props;
  const { markings, ...values } = props.values;
  const { title } = useRoute()!;

  const [currentPage, setCurrentPage] = useState<PageState>('default');
  const modalProps: any = {
    onCancel: () => setCurrentPage('default'),
    footer: null,
    width: 900,
    bodyStyle: { 
      padding: 0,
      paddingTop: '30px',
      display: 'flex', 
      justifyContent: 'center', 
      maxHeight: '80vh',
      overflowY: 'scroll'
    }
  };

  return (
    <Fragment>
      <BasicView
        values={values}
        items={items}
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
            <Button 
              onClick={() => print(markings, printPreset)}
              style={{ marginTop: '25px', float: 'right' }}>
              Laporan Rugi Laba
            </Button>
          </Fragment>
        } />
        <Modal centered maskClosable
          title={`Buat Surat Jalan ${title}`}
          visible={(currentPage !== 'default') && (currentPage.type === 'travel_document')}
          {...modalProps}>
          <TravelDocumentForm 
            key={Date.now()}
            values={{ ...values, ...(currentPage as IAltPageState).marking }} />
        </Modal>
        <Modal centered maskClosable
          title={`Buat Faktur ${title}`}
          visible={(currentPage !== 'default') && (currentPage.type === 'invoice')}
          {...modalProps}>
          <InvoiceForm 
            key={Date.now()}
            values={{ ...values, ...(currentPage as IAltPageState).marking }} />
        </Modal>
    </Fragment>
  );
}

export default View;

interface IViewProps extends IInjectedProps {
  items: Array<IViewItem>
  columns: ColumnsType<any>
  TravelDocumentForm: ComponentType<IInjectedProps>
  InvoiceForm: ComponentType<IInjectedProps>
  printPreset: Presets
}

interface IAltPageState {
  type: 'travel_document' | 'invoice'
  marking: any
}

type PageState = 'default' | IAltPageState;
