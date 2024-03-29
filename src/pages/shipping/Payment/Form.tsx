import { FC, Fragment, useState } from "react";
import styled from "styled-components";
import { Typography, Table, Input, DatePicker, Button, Popconfirm, Divider, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import moment from "moment";
import useDatabase from "../../../data/useDatabase";
import { IInjectedProps } from "../../../components/abstractions/withFormHandling";
import { DEFAULT_SYMBOL } from "../../../components/abstractions/useCurrencyHandling";
import InputCurrency from "../../../components/basics/InputCurrency";
import { commaSeparate, dateToString } from "../../../utils";

const { Text } = Typography;
const year = (new Date().getFullYear() - 2000) * 10000;

const PaymentForm: FC<IInjectedProps> = props => {
  const { initialValues, onSubmit } = props;
  const database = useDatabase();
  const [items, setItems] = useState(initialValues?.items ?? []);

  const [date, setDate] = useState(new Date());
  const [type, setType] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const total = items.reduce((acc: number, item: any) => acc + item.amount, 0);

  const handleAdd = () => {
    if (type.length === 0 || amount.length === 0) {
      message.error("Ada input yang belum diisi.");
    }
    else {
      setItems([...items, { date, type, amount, description }]);
      setType('');
      setAmount('');
      setDescription('');
    }
  }

  const handleDelete = (index: number) => {
    setItems((items: Array<never>) => items.filter((_, i) => i !== index));
  }

  const handleSubmit = async () => {
    if (initialValues && ('id' in initialValues)) {
      // Simply update the items if this is an edit form.
      onSubmit({ ...initialValues, items });
    }
    else {
      // Otherwise its an add form, in which we figure out the id to use:
      const payments = database?.collection('Payments');
      const results = await payments?.aggregate([{ $group: { _id: null, max: { $max: '$id' } } }]);
      const lastId = (results.length > 0) ? (results[0].max - year) : -1;
      const id = (lastId < 0) ? year : (lastId + year + 1);

      // Then submit the items with the new id.
      onSubmit({ id, items });
    }
  }

  return (
    <Container>
      <div>
        <div>
          <span>
            {initialValues && (
              <Fragment>
                <Text strong>Kode Pembayaran: </Text>
                {initialValues.id}
              </Fragment>
            )}
          </span>
          <span>
            <Text strong>Total Pembayaran: </Text> 
            {DEFAULT_SYMBOL}{commaSeparate(total)}
          </span>
        </div>
        <Divider style={{ margin: '10px' }} />
        <div>
          <div>
            <DatePicker 
              placeholder="Tanggal" 
              value={moment(date)} 
              onChange={value => value && setDate(value.toDate())}
              style={{ width: '100%' }} />
            <Input 
              placeholder="Jenis Pembayaran"
              value={type}
              onChange={e => setType(e.target.value)} />
          </div>
          <div>
            <InputCurrency 
              placeholder="Jumlah"
              value={amount}
              onChange={value => setAmount(value)} />
            <Input 
              placeholder="Keterangan"
              value={description}
              onChange={e => setDescription(e.target.value)} />
          </div>
          <Button
            icon={<PlusOutlined />}
            onClick={handleAdd}>
            Baru
          </Button>
        </div>
        <Table
          size="small"
          pagination={false}
          dataSource={items}
          columns={[
            { 
              dataIndex: 'date', 
              title: 'Tanggal',
              render: value => dateToString(value),
              width: 180
            },
            { dataIndex: 'type', title: 'Jenis Pembayaran' },
            { 
              dataIndex: 'amount', 
              title: 'Jumlah',
              render: value => DEFAULT_SYMBOL + commaSeparate(value)
            },
            { dataIndex: 'description', title: 'Keterangan' },
            {
              fixed: 'right',
              render: (_, __, i) => (
                <Popconfirm
                  title="Yakin di hapus?" 
                  placement="left"
                  onCancel={e => e?.stopPropagation()}
                  onConfirm={e => {
                    e?.stopPropagation(); 
                    handleDelete(i);
                  }}>
                  <Button onClick={e => e.stopPropagation()}>Hapus</Button>
                </Popconfirm>
              )
            }
          ]} />
          <Button
            type="primary"
            onClick={handleSubmit}>
            Simpan
          </Button>
      </div>
    </Container>
  );
}

export default PaymentForm;

const Container = styled.div`
  > div {
    width: 600px;

    > div:nth-child(3) {
      margin: 10px 0;
    }

    > div:first-child, > div:nth-child(3) {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      > div {
        width: calc(50% - 50px);

        > *:first-child {
          margin-bottom: 10px;
        }
      }
    }

    > button:last-child {
      margin-top: 10px;
      float: right;
    }
  }
`;
