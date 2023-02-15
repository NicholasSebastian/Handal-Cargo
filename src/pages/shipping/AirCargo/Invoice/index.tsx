import { FC, useState, useEffect } from "react";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import TableTemplate from "../../../../components/compounds/ViewTableTemplate";
import { IPageProps } from "../index";
import useDatabase from "../../../../data/useDatabase";
import print from "../../../../print";
import { dateToString, formatCurrency } from "../../../../utils";

const Invoice: FC<IPageProps> = props => {
  const { goBack } = props;
  const database = useDatabase();
  const [currencySymbols, setCurrencySymbols] = useState<Record<string, string>>();

  return <div />
}

export default Invoice;
