import { FC, Fragment, useRef } from "react";
import { Button, message } from "antd";
import moment from "moment";
import useDatabase from "../../../../data/useDatabase";
import { useCloseModal } from "../../../../components/compounds/TableTemplate";
import BasicForm from "../../../../components/basics/BasicForm";
import getFormInjector from "../../../../components/abstractions/getFormInjector";
import InputMeasurement from "../../../../components/specialized/InputMeasurement";
import { IFormProps } from "../View";
import print from "../../../../print";
import { momentsToDates } from "../../../../utils";

const TravelDocumentForm: FC<IFormProps> = props => {
  const { values, setCurrentPage } = props;
  const database = useDatabase();
  const closeModal = useCloseModal();
  const isDaerahType = useRef<boolean>();

  // TODO

  return <div />
}

export default TravelDocumentForm;
