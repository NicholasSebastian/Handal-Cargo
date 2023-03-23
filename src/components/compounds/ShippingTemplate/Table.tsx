import { FC, ComponentType, Fragment, useState } from "react";
import { Space, Button, Modal } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FileDoneOutlined, AuditOutlined } from "@ant-design/icons";
import useDatabase from "../../../data/useDatabase";
import useRoute from "../../../data/useRoute";
import { IData } from "../../abstractions/withTemplateHandling";
import BaseTableTemplate, { FormPropType, ViewPropType } from "../TableTemplate";
import { markingAggregation, aggregationLookup } from "./marking-aggregation";

const pipeline = [
  ...aggregationLookup.map(args => ({ $lookup: args })),
  { $set: { 'markings': markingAggregation } },
  { $project: Object.fromEntries(aggregationLookup.map(args => ([args.as, false]))) }
];

const TableTemplate: FC<ITemplateProps> = props => {
  const { collectionName, searchBy, columns, queryPipeline, View, Form, TravelDocument, Invoice } = props;
  const { title } = useRoute()!;
  const database = useDatabase();

  const [currentPage, setCurrentPage] = useState<PageState>('default');
  const modalProps = {
    onCancel: () => setCurrentPage('default'),
    footer: null,
    width: 900,
    bodyStyle: { 
      padding: 0, 
      paddingBottom: '10px' 
    }
  };

  return (
    <Fragment>
      <BaseTableTemplate
        collectionName={collectionName}
        searchBy={searchBy}
        excludeFromSearch={['arrival_date']}
        width={1050}
        modalWidth={850}
        query={(collectionName, search, searchKey) => {
          const extra = queryPipeline ?? [];
          if (search)
            return database?.collection(collectionName).aggregate([
              { $match: { [searchKey]: { $regex: search } } }, 
              ...pipeline, 
              ...extra
            ]);
          else
            return database?.collection(collectionName).aggregate([
              ...pipeline, 
              ...extra
            ]);
        }}
        itemQuery={(collectionName, id) => database?.collection(collectionName)
          .aggregate([{ $match: { _id: id } }, ...pipeline])
          .then(results => results[0])
        }
        deleteCheck={async (_, entry) => {
          const markings = entry.markings?.map((marking: any) => marking.marking_id);
          const inTravelDocuments = database?.collection('TravelPermits').findOne({ marking_id: { $in: markings } });
          const inInvoices = database?.collection('Invoices').findOne({ marking_id: { $in: markings } });
          const inMarkings = await Promise.all([inTravelDocuments, inInvoices]);
          return inMarkings.every(marking => marking == null);
        }}
        showIndicator={values => values.markings.every((marking: any) => marking.paid && marking.invoices > 0) }
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
      <Modal centered maskClosable
        title={`Surat Jalan ${title}`}
        visible={currentPage === 'travel_permits'}
        {...modalProps}>
        <TravelDocument key={Date.now()} />
      </Modal>
      <Modal centered maskClosable
        title={`Faktur ${title}`}
        visible={currentPage === 'invoices'}
        {...modalProps}>
        <Invoice key={Date.now()} />
      </Modal>
    </Fragment>
  );
}

export default TableTemplate;

interface ITemplateProps {
  collectionName: string
  searchBy: string
  columns: ColumnsType<IData>
  queryPipeline?: Array<any>
  View: ViewPropType
  Form: FormPropType
  TravelDocument: ComponentType
  Invoice: ComponentType
}

type PageState = 'default' | 'travel_permits' | 'invoices'
