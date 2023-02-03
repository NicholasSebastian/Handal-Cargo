import { FC, useState } from "react";
import styled from "styled-components";
import { Form, List, Input, Button, Popconfirm, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import useDatabase from "../../../data/useDatabase";
import { ICustomComponentProps } from "../../../components/basics/BasicForm";

const { useFormInstance } = Form; // https://ant.design/components/form#formuseforminstance
const { Item } = List;

const MarkingTable: FC<ICustomComponentProps> = props => {
  const { value } = props;
  const database = useDatabase();
  const form = useFormInstance();
  const [markingInput, setMarkingInput] = useState('');
  const [loading, setLoading] = useState(false);

  const checkCollisions = () => new Promise<boolean>((resolve, reject) => {
    const existsLocally = value?.some((marking: string) => marking === markingInput);
    if (existsLocally) return resolve(true);

    setLoading(true);
    database?.collection('Customers')
      .aggregate([
        { $project: { _id: 0, marking: '$markings' } },
        { $unwind: "$marking" },
        { $match: { marking: markingInput } }
      ])
      .finally(() => setLoading(false))
      .then(results => {
        const existsGlobally = results.length > 0;
        return resolve(existsGlobally);
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
      checkCollisions().then(alreadyExists => {
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
    handleChange(value.filter((i: string) => i !== item));
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
          Add
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
              <Button onClick={e => e.stopPropagation()}>Delete</Button>
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
