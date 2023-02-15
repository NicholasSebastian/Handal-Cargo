import { FC, Fragment } from "react";
import { Button, message } from "antd";
import moment from "moment";
import useDatabase from "../../../../data/useDatabase";
import { useCloseModal } from "../../../../components/compounds/TableTemplate";
import BasicForm from "../../../../components/basics/BasicForm";
import createDependentValue from "../../../../components/basics/DependentValue";
import { DEFAULT_SYMBOL } from "../../../../components/abstractions/useCurrencyHandling";
import getFormInjector, { injectUser } from "../../../../components/abstractions/getFormInjector";
import InputMeasurement from "../../../../components/specialized/InputMeasurement";
import DisplayTotal from "../../../../components/specialized/DisplayTotal";
import { IFormProps } from "../View";
import print from "../../../../print";
import { momentsToDates, formatCurrency } from "../../../../utils";

const InvoiceForm: FC<IFormProps> = props => {
  const { values, setCurrentPage } = props;
  const database = useDatabase();
  const closeModal = useCloseModal();

  // TODO

  return <div />
}

export default InvoiceForm;
