import { FC } from "react";
import styled from "styled-components";
import { Descriptions, Table } from "antd";
import { formatCurrency, dateToString } from "../../../utils";
import { IInjectedProps } from "../../../components/abstracts/withInitialData";

const { Item } = Descriptions;

const PaymentView: FC<IInjectedProps> = props => {
  const { values } = props;
  return (
    <ViewContainer
      column={1}
      labelStyle={{ fontWeight: 500 }}>
      <Item label="Kode Pembayaran">
        {values['_id'].toString()}
      </Item>
      <Item label="Total Pembayaran">
        Rp. {formatCurrency(values.items.reduce((acc: number, item: any) => acc + item.amount, 0))}
      </Item>
      <Item>
        <Table bordered
          size="small"
          dataSource={values.items}
          pagination={false}
          columns={[
            { dataIndex: 'date', title: 'Tanggal', render: value => dateToString(value) },
            { dataIndex: 'type', title: 'Jenis Pembayaran' },
            { dataIndex: 'amount', title: 'Jumlah' },
            { dataIndex: 'description', title: 'Keterangan' }
          ]}
          style={{ width: '100%' }} />
      </Item>
    </ViewContainer>
  );
}

export default PaymentView;

const ViewContainer = styled(Descriptions)`
  width: 550px;
`;
