import { ComponentType, FC, useState } from "react";
import { Space, Button } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FileDoneOutlined, AuditOutlined } from "@ant-design/icons";
import BaseTableTemplate, { FormPropType, ViewPropType } from "../TableTemplate";
import { IData } from "../../abstractions/withTemplateHandling";
import useDatabase from "../../../data/useDatabase";
import { markingAggregation, aggregationLookup } from "./marking-aggregation";

const TableTemplate: FC<ITemplateProps> = props => {
  const { collectionName, searchBy, columns, View, Form, TravelDocument, Invoice } = props;
  const database = useDatabase();
  const [currentPage, setCurrentPage] = useState<PageState>('default');
  const pageProps: IPageProps = { 
    goBack: () => setCurrentPage('default') 
  };

  switch (currentPage) {
    case 'travel_permits':
      return <TravelDocument {...pageProps} />

    case 'invoices':
      return <Invoice {...pageProps} />

    default:
      return (
        <BaseTableTemplate
          collectionName={collectionName}
          searchBy={searchBy}
          width={1050}
          modalWidth={850}
          itemQuery={(collectionName, id) => database?.collection(collectionName)
            .aggregate([
              { $match: { _id: id } },
              ...aggregationLookup.map(args => ({ $lookup: args })),
              { $set: { 'markings': markingAggregation } },
              { $project: Object.fromEntries(aggregationLookup.map(args => ([args.as, false]))) }
            ])
            .then(results => results[0])
          }
          showIndicator={values => values.paid}
          view={View}
          form={Form}
          columns={columns}
          extra={
            <Space>
              <Button 
                icon={<FileDoneOutlined />}
                onClick={() => setCurrentPage('travel_permits')}>
                Surat Jalan
              </Button>
              <Button 
                icon={<AuditOutlined />}
                onClick={() => setCurrentPage('invoices')}>
                Faktur
              </Button>
            </Space>
          } />
      );
  }
}

export type { IPageProps };
export default TableTemplate;

interface ITemplateProps {
  collectionName: string
  searchBy: string
  columns: ColumnsType<IData>
  View: ViewPropType
  Form: FormPropType
  TravelDocument: ComponentType<IPageProps>
  Invoice: ComponentType<IPageProps>
}

interface IPageProps {
  goBack: () => void
}

type PageState = 'default' | 'travel_permits' | 'invoices'
