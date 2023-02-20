import { FC } from "react";
import styled from "styled-components";
import { Descriptions, Table } from "antd";
import { formatCurrency, dateToString } from "../../../utils";
import { IInjectedProps } from "../../../components/abstractions/withInitialData";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";

const { Item } = Descriptions;

const PaymentView: FC<IInjectedProps> = props => {
  const { values } = props;
  const total = values.items.reduce((acc: number, item: any) => acc + item.amount, 0);
  return (
    <ViewContainer
      column={1}
      labelStyle={{ fontWeight: 500 }}>
      <Item label="Kode Pembayaran">
        {values['_id'].toString()}
      </Item>
      <Item label="Total Pembayaran">
        {DEFAULT_SYMBOL}{formatCurrency(total)}
      </Item>
      <Item>
        <Table bordered
          size="small"
          dataSource={values.items}
          pagination={false}
          columns={[
            { dataIndex: 'date', title: 'Tanggal', width: 190, render: value => dateToString(value) },
            { dataIndex: 'type', title: 'Jenis Pembayaran', width: 140 },
            { dataIndex: 'amount', title: 'Jumlah', width: 130, render: value => DEFAULT_SYMBOL + formatCurrency(value) },
            { dataIndex: 'description', title: 'Keterangan' }
          ]}
          style={{ width: '100%' }} />
      </Item>
    </ViewContainer>
  );
}

export default PaymentView;

const ViewContainer = styled(Descriptions)`
  width: calc(100% - 100px);
`;
