import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Form, Table, Select, Button, Popconfirm, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { useUser } from "../../../data/useDatabase";
import useDatabase from "../../../data/useDatabase";
import { ICustomComponentProps } from "../../../components/basics/BasicForm";
import InputCurrency from "../../../components/basics/InputCurrency";
import { formatCurrency } from "../../../utils";

const { useFormInstance } = Form;
const { Option } = Select;

const DetailsTable: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const database = useDatabase();
  const user = useUser();
  const form = useFormInstance();
  const [productDetails, setProductDetails] = useState<Array<string>>();
  const [routes, setRoutes] = useState<Array<string>>();

  const [productDetail, setProductDetail] = useState<string>();
  const [route, setRoute] = useState<string>();
  const [transport, setTransport] = useState<string>("Air");
  const [price, setPrice] = useState<string>();

  useEffect(() => {
    database?.collection("ProductDetails")
      .find({}, { projection: { name: 1 } })
      .then(values => setProductDetails(values.map(value => value.name)));
    database?.collection("Routes")
      .find({}, { projection: { name: 1 } })
      .then(values => setRoutes(values.map(value => value.name)));
  }, []);

  const handleChange = (details: Array<any>) => {
    form.setFieldsValue({ ...form.getFieldsValue(true), details });
  }
  
  const handleAdd = () => {
    if (!productDetail || !route || !price) {
      message.error("Ada input yang belum diisi.");
    }
    else {
      const username = user?.profile.name;
      const newValue = { productDetail, route, transport, price, user: username };
      if (value) {
        handleChange([...value, newValue]);
      }
      else {
        handleChange([newValue]);
      }

      // Clear the inputs afterwards.
      setProductDetail(undefined);
      setRoute(undefined);
      setPrice(undefined);
    }
  }

  const handleDelete = (index: number) => {
    handleChange(value.filter((_: never, i: number) => i !== index));
  }

  return (
    <DetailsContainer>
      <div>
        <div>
          <Select 
            placeholder="Keterangan Barang"
            value={productDetail}
            onChange={value => setProductDetail(value)}>
            {productDetails?.map((item, i) => (
              <Option key={i} value={item}>{item}</Option>
            ))}
          </Select>
          <Select 
            value={transport}
            onChange={value => setTransport(value)}>
            <Option value="Air">By Air</Option>
            <Option value="Sea">By Sea</Option>
          </Select>
        </div>
        <div>
          <Select 
            placeholder="Rute"
            value={route}
            onChange={value => setRoute(value)}>
            {routes?.map((item, i) => (
              <Option key={i} value={item}>{item}</Option>
            ))}
          </Select>
          <InputCurrency 
            placeholder="Harga"
            value={price}
            onChange={value => setPrice(value)} />
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={handleAdd}>
          Baru
        </Button>
      </div>
      <Table
        size='small'
        dataSource={value}
        pagination={false}
        columns={[
          { dataIndex: 'productDetail', title: 'Keterangan Barang' },
          { dataIndex: 'transport', title: 'By' },
          { dataIndex: 'route', title: 'Rute' },
          { 
            dataIndex: 'price', 
            title: 'Harga', 
            render: value => 'Rp.' + formatCurrency(value) 
          },
          { dataIndex: 'user', title: 'User' },
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
    </DetailsContainer>
  );
}

export default DetailsTable;

const DetailsContainer = styled.div`
  > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;

    > div {
      width: calc(50% - 50px);

      > *:first-child {
        margin-bottom: 10px;
      }
    }
  }
`;
