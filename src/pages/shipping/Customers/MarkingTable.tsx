import { FC, useState } from "react";
import styled from "styled-components";
import { Form, List, Input, Button, Popconfirm, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import useDatabase from "../../../data/useDatabase";
import { ICustomComponentProps } from "../../../components/basics/BasicForm";

const { useFormInstance } = Form;
const { Item } = List;

const MarkingTable: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const database = useDatabase();
  const form = useFormInstance();
  const [markingInput, setMarkingInput] = useState('');
  const [loading, setLoading] = useState(false);

  const checkCollisions = () => new Promise<boolean>((resolve, reject) => {
    // Check if the marking already exists in the local table.
    const existsLocally = value?.some((marking: string) => marking === markingInput);
    if (existsLocally) {
      return resolve(true);
    }

    // Check if the marking already exists in the database.
    setLoading(true);
    database?.collection('Customers')
      .count({ markings: markingInput })
      .finally(() => setLoading(false))
      .then(result => {
        const existsGlobally = result > 0;
        resolve(existsGlobally);
      })
      .catch(reject);
  })

  const handleChange = (markings: Array<string>) => {
    form.setFieldsValue({ ...form.getFieldsValue(true), markings });
  }

  const handleAdd = () => {
    if (markingInput.length === 0) {
      message.error("Marking belum diisi.");
    }
    else {
      checkCollisions()
        .then(alreadyExists => {
          if (alreadyExists) {
            message.error(`Marking '${markingInput}' sudah ada.`);
          }
          else {
            if (value) {
              handleChange([...value, markingInput]);
            }
            else {
              handleChange([markingInput]);
            }
            setMarkingInput('');
          }
        });
    }
  }

  const handleDelete = (item: string) => {
    setLoading(true);
    deleteCheck(item)
      .then(allowed => {
        if (allowed) 
          handleChange(value.filter((i: string) => i !== item));
        else 
          message.error("Marking ini tidak boleh dihapus.");
      })
      .finally(() => setLoading(false));
  }

  const deleteCheck = async (marking: string) => {
    // Check if the marking is already being used in a SeaFreight or AirCargo entry.
    const inSeafreightMarkings = database?.collection('SeaFreight').findOne({ 'markings.marking': marking });
    const inAirCargoMarkings =  database?.collection('AirCargo').findOne({ 'markings.marking': marking });
    const markings = await Promise.all([inSeafreightMarkings, inAirCargoMarkings]);
    return markings.every(marking => marking == null);
  }

  return (
    <MarkingContainer>
      <div>
        <Input 
          placeholder="Marking" 
          value={markingInput} 
          onChange={e => setMarkingInput(e.target.value)} />
        <Button 
          loading={loading}
          icon={<PlusOutlined />}
          onClick={handleAdd}> 
          Baru
        </Button>
      </div>
      <List
        size="small"
        dataSource={value}
        renderItem={(item: string, i) => (
          <Item key={i} actions={[
            <Popconfirm 
              title='Yakin di hapus?'
              placement="left"
              onCancel={e => e?.stopPropagation()}
              onConfirm={e => {
                e?.stopPropagation();
                handleDelete(item);
              }}>
              <Button 
                loading={loading} 
                onClick={e => e.stopPropagation()}>
                Hapus
              </Button>
            </Popconfirm>
          ]}>
            {item}
          </Item>
        )} />
    </MarkingContainer>
  );
}

export default MarkingTable;

const MarkingContainer = styled.div`
  > div:first-child {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    > *:first-child {
      width: calc(100% - 90px);
    }
  }
`;
