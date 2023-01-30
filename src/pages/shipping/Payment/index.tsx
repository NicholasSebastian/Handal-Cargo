import { FC } from "react";
import styled from "styled-components";
import { Descriptions, Table } from "antd";
import TableTemplate from "../../../components/compounds/TableTemplate";
import PaymentForm from "./PaymentForm";
import { formatCurrency, dateToString } from "../../../utils";

const { Item } = Descriptions;

const Payment: FC = () => {
  return (
    <TableTemplate
      collectionName="Payments"
      modalWidth={700}
      columns={[
        { 
          dataIndex: "_id", 
          title: "Kode Pembayaran", 
          render: id => id.toString() 
        },
        { 
          title: "Total Pembayaran",
          render: (_, row) => 'Rp. ' + formatCurrency(row.items.reduce((acc: number, item: any) => acc + item.amount, 0))
        }
      ]}
      form={PaymentForm}
      view={props => {
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
              <Table
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
      }} />
  );
}

export default Payment;

const ViewContainer = styled(Descriptions)`
  width: 550px;
`;
