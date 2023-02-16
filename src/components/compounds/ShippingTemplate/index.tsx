import { FC, ComponentType, useMemo, lazy } from "react";
import { ColumnsType } from "antd/lib/table";
import useRoute from "../../../data/useRoute";
import { IData } from "../../abstractions/withTemplateHandling";
import { IViewItem } from "../../basics/BasicView";
import { FormItem, gap } from "../../basics/BasicForm";
import { Presets } from "../../../print";
import { MarkingField, fieldsToMarkingColumns } from "./MarkingTable";
import TravelDocumentForm from "./TravelDocumentForm";
import { CurrencyFormatter } from "./Invoice";
import InvoiceForm from "./InvoiceForm";

const TableTemplate = lazy(() => import("./Table"));
const View = lazy(() => import("./View"));
const MarkingTable = lazy(() => import("./MarkingTable"));
const TravelDocument = lazy(() => import("./TravelDocument"));
const Invoice = lazy(() => import("./Invoice"));

// Intended for use to build the AirCargo and SeaFreight pages.

const ShippingTemplate: FC<IShippingProps> = props => {
  const { collectionName, searchBy, columns } = props;
  const { viewItems, markingFields, markingTableWidth } = props;
  const { formItems, MarkingTableDetails } = props;
  const { travelDocumentColumns, travelDocumentViewItems, travelDocumentFormItems } = props;
  const { invoiceColumns, invoiceViewItems, invoiceFormItems } = props;
  const { travelDocumentPrintPreset, travelDocumentDaerahPrintPreset } = props;
  const { profitLossPrintPreset, invoicePrintPreset } = props;
  const { title } = useRoute()!;
  const markingColumns = useMemo(() => fieldsToMarkingColumns(markingFields), []);

  return (
    <TableTemplate
      collectionName={collectionName}
      searchBy={searchBy}
      columns={columns}
      View={props => (
        <View
          {...props}
          printPreset={profitLossPrintPreset}
          columns={markingColumns}
          items={viewItems}
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
          viewItems={travelDocumentViewItems} />
      )}
      Invoice={props => (
        <Invoice
          {...props}
          title={`Faktur ${title}`}
          printPreset={invoicePrintPreset}
          columns={invoiceColumns}
          viewItems={invoiceViewItems} />
      )} />
  );
}

export type { IViewAndFormStuff, IMarkingsStuff, ITravelDocumentsStuff, IInvoicesStuff };
export default ShippingTemplate;

interface IShippingProps extends IViewAndFormStuff, IMarkingsStuff, ITravelDocumentsStuff, IInvoicesStuff {
  collectionName: string
  searchBy: string
  columns: ColumnsType<IData>
}

interface IViewAndFormStuff {
  viewItems: Array<IViewItem>
  formItems: Array<FormItem>
  profitLossPrintPreset: Presets
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
}

interface IInvoicesStuff {
  invoiceColumns: (currencyFmt: CurrencyFormatter) => ColumnsType<any>
  invoiceViewItems: (currencyFmt: CurrencyFormatter) => Array<IViewItem>
  invoiceFormItems: Array<FormItem>
  invoicePrintPreset: Presets
}
