import { FC, ComponentType, useMemo } from "react";
import { ColumnsType } from "antd/lib/table";
import useRoute from "../../../data/useRoute";
import { Presets } from "../../abstractions/usePrint";
import { IData } from "../../abstractions/withTemplateHandling";
import { IViewItem } from "../../basics/BasicView";
import { FormItem, gap } from "../../basics/BasicForm";
import TableTemplate from "./Table";
import View from "./View";
import MarkingTable, { MarkingField, fieldsToMarkingColumns } from "./MarkingTable";
import TravelDocument from "./TravelDocument";
import TravelDocumentForm from "./TravelDocumentForm";
import Invoice, { CurrencyFormatter } from "./Invoice";
import InvoiceForm from "./InvoiceForm";

// Intended for use to build the AirCargo and SeaFreight pages.

// NOTE: This component creates more components inside of it, which is an antipattern.
//       But in this case its fine I guess.

const ShippingTemplate: FC<IShippingProps> = props => {
  const { collectionName, searchBy, columns, queryPipeline } = props;
  const { viewItems, calculateTotalFee, markingFields, markingTableWidth } = props;
  const { formItems, MarkingTableDetails } = props;
  const { travelDocumentColumns, travelDocumentViewItems, travelDocumentFormItems } = props;
  const { invoiceColumns, invoiceViewItems, invoiceFormItems } = props;
  const { travelDocumentFilter, invoiceFilter } = props;
  const { travelDocumentPrintPreset, travelDocumentDaerahPrintPreset } = props;
  const { profitLossPrintPreset, invoicePrintPreset } = props;
  const { title } = useRoute()!;
  const markingColumns = useMemo(() => fieldsToMarkingColumns(markingFields), []);

  return (
    <TableTemplate
      collectionName={collectionName}
      searchBy={searchBy}
      columns={columns}
      queryPipeline={queryPipeline}
      View={props => (
        <View
          {...props}
          printPreset={profitLossPrintPreset}
          columns={markingColumns}
          items={viewItems}
          calculateTotalFee={calculateTotalFee}
          TravelDocumentForm={props => (
            <TravelDocumentForm
              {...props}
              printPreset={travelDocumentPrintPreset}
              printDaerahPreset={travelDocumentDaerahPrintPreset}
              items={travelDocumentFormItems} />
          )}
          InvoiceForm={props => (
            <InvoiceForm
              {...props}
              printPreset={invoicePrintPreset}
              items={invoiceFormItems} />
          )} />
      )}
      Form={{
        labelSpan: 12,
        twoColumns: true,
        items: [
          ...formItems,
          'pagebreak',
          { 
            key: 'markings', 
            type: 'custom', 
            render: props => (
              <MarkingTable
                {...props}
                fields={markingFields}
                columns={markingColumns}
                width={markingTableWidth} />
            ) 
          },
          gap,
          { 
            type: 'custom', 
            render: MarkingTableDetails 
          }
        ]
      }}
      TravelDocument={props => (
        <TravelDocument
          {...props}
          title={`Surat Jalan ${title}`}
          printPreset={travelDocumentPrintPreset}
          printDaerahPreset={travelDocumentDaerahPrintPreset}
          columns={travelDocumentColumns}
          viewItems={travelDocumentViewItems}
          filter={travelDocumentFilter} />
      )}
      Invoice={props => (
        <Invoice
          {...props}
          title={`Faktur ${title}`}
          printPreset={invoicePrintPreset}
          columns={invoiceColumns}
          viewItems={invoiceViewItems}
          filter={invoiceFilter} />
      )} />
  );
}

export type { IViewAndFormStuff, IMarkingsStuff, ITravelDocumentsStuff, IInvoicesStuff };
export default ShippingTemplate;

interface IShippingProps extends IViewAndFormStuff, IMarkingsStuff, ITravelDocumentsStuff, IInvoicesStuff {
  collectionName: string
  searchBy: string
  columns: ColumnsType<IData>
  queryPipeline?: Array<any>
}

interface IViewAndFormStuff {
  viewItems: Array<IViewItem>
  formItems: Array<FormItem>
  profitLossPrintPreset: Presets
  calculateTotalFee: (record: Record<string, any>) => number
}

interface IMarkingsStuff {
  markingFields: Array<MarkingField>
  markingTableWidth: number
  MarkingTableDetails: ComponentType
}

interface ITravelDocumentsStuff {
  travelDocumentColumns: ColumnsType<any>
  travelDocumentViewItems: Array<IViewItem>
  travelDocumentFormItems: Array<FormItem>
  travelDocumentPrintPreset: Presets
  travelDocumentDaerahPrintPreset: Presets
  travelDocumentFilter: Record<string, { $exists: true }>
}

interface IInvoicesStuff {
  invoiceColumns: (currencyFmt: CurrencyFormatter) => ColumnsType<any>
  invoiceViewItems: (currencyFmt: CurrencyFormatter) => Array<IViewItem>
  invoiceFormItems: Array<FormItem>
  invoicePrintPreset: Presets
  invoiceFilter: Record<string, { $exists: true }>
}
