import { ComponentType, FC, Fragment, useState } from "react";
import { Table, Space, Button, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FileDoneOutlined, AuditOutlined } from "@ant-design/icons";
import { IInjectedProps } from "../../abstractions/withInitialData";
import BasicView, { IViewItem } from "../../basics/BasicView";
import print, { Presets } from "../../../print";

const View: FC<IViewProps> = props => {
  const { items, columns, TravelDocumentForm, InvoiceForm, printPreset } = props;
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
          <div>
            <Button 
              onClick={() => print(markings, printPreset)}
              style={{ marginTop: '25px', float: 'right' }}>
              Laporan Rugi Laba
            </Button>
          </div>
        </Fragment>
      } />
  );
}

export type { IFormProps };
export default View;

interface IViewProps extends IInjectedProps {
  items: Array<IViewItem>
  columns: ColumnsType<any>
  TravelDocumentForm: ComponentType<IFormProps>
  InvoiceForm: ComponentType<IFormProps>
  printPreset: Presets
}

interface IFormProps extends IInjectedProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<PageState>>
}

interface IAltPageState {
  type: 'travel_document' | 'invoice'
  marking: any
}

type PageState = 'default' | IAltPageState;
