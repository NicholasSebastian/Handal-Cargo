import { FC } from "react";
import { ColumnsType } from "antd/lib/table";
import useRoute from "../../../data/useRoute";
import { IData } from "../../abstractions/withTemplateHandling";
import { IViewItem } from "../../basics/BasicView";
import { RenderItem } from "../../basics/BasicForm";
import { MarkingField } from "./MarkingTable";
import { CurrencyFormatter } from "./Invoice";
import { Presets } from "../../../print";

const ShippingTemplate: FC<IShippingProps> = props => {
  const { collectionName, searchBy, columns, viewItems, markingFields, markingTableWidth } = props;
  const { travelDocumentColumns, travelDocumentItems, invoiceColumns, invoiceItems } = props;
  const { travelDocumentPrintPreset, travelDocumentDaerahPrintPreset } = props;
  const { profitLossPrintPreset, invoicePrintPreset } = props;
  const { title } = useRoute()!;

  // TODO: Assemble all the props and components here!

  return <div />
}

export default ShippingTemplate;

interface IShippingProps {
  // Home page.
  collectionName: string
  searchBy: string
  columns: ColumnsType<IData>

  // View page.
  viewItems: Array<IViewItem> // Note: get the view marking columns from the marking fields below.
  profitLossPrintPreset: Presets

  // Markings.
  markingFields: Array<MarkingField>
  markingTableWidth: number

  // Travel Documents page.
  travelDocumentColumns: ColumnsType<any>
  travelDocumentItems: Array<IViewAndFormItem>
  travelDocumentPrintPreset: Presets
  travelDocumentDaerahPrintPreset: Presets

  // Invoice page.
  invoiceColumns: (currencyFmt: CurrencyFormatter) => ColumnsType<any>
  invoiceItems: (currencyFmt: CurrencyFormatter) => Array<IViewAndFormItem>
  invoicePrintPreset: Presets
}

interface IViewAndFormItem {
  key: string
  label: string
  viewRender?: (value: any, values: Record<string, any>) => any
  formRender?: Omit<RenderItem, 'key' | 'label'>
  required?: boolean
  disabled?: boolean
}
