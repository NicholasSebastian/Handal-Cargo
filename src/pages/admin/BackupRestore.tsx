import { open } from '@tauri-apps/api/shell';
import { writeTextFile, readTextFile } from "@tauri-apps/api/fs";
import { open as select, save, SaveDialogOptions } from '@tauri-apps/api/dialog';
import { FC, useState } from "react";
import styled from "styled-components";
import { Button, Alert, Transfer, message } from "antd";
import useDatabase from "../../data/useDatabase";

const MONGODB_ATLAS_URL = "https://cloud.mongodb.com/";

const collections = [
  "AccessLevels",
  // "AirCargo",
  "Carriers",
  "ContainerGroups",
  "Currencies",
  "Customers",
  "Expeditions",
  "Handlers",
  // "Invoices",
  // "Payments",
  "Planes",
  "ProductDetails",
  "Routes",
  // "SeaFreight",
  "Singletons",
  "Staff",
  "StaffGroups"
];

const options: SaveDialogOptions = {
  filters: [{
    name: 'JSON File',
    extensions: ['json']
  }]
};

const BackupRestore: FC = () => {
  const database = useDatabase();
  const [targetKeys, setTargetKeys] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(false);

  const onBackup = () => {
    setLoading(true);
    Promise.all(targetKeys.map(collection => database?.collection(collection).find().then(data => ({ collection, data }))))
      .then(results => save(options).then(filepath => ({ filepath, data: JSON.stringify(results) })))
      .then(response => writeTextFile(response.filepath, response.data))
      .then(() => message.success("Backup data berhasil disimpan."))
      .catch(() => message.error("Error terjadi ketika mengunduh backup data."))
      .finally(() => setLoading(false));
  }

  const onRestore = () => {
    setLoading(true);
    select(options)
      .then(filepath => {
        if (filepath) return readTextFile(filepath as string);
        else throw new Error();
      })
      .then(data => {
        console.log(JSON.parse(data));
        // TODO: replace all the included collections with the data.
      })
      .catch(() => message.error("Error terjadi ketika membaca backup data."))
      .finally(() => setLoading(false));
  }

  return (
    <Container>
      <div>
        <Alert showIcon 
          type="info" 
          message="Tanya Ifat kalau perlu bantuan." />
        <Button 
          type="primary" 
          onClick={() => open(MONGODB_ATLAS_URL)}>
          Dasbor Database
        </Button>
      </div>
      <div>
        <Transfer oneWay
          titles={['Semua', 'Akan di Backup']}
          dataSource={collections.map(collection => ({ key: collection, title: collection }))}
          render={item => item.title}
          operations={['Include']}
          targetKeys={targetKeys}
          onChange={keys => setTargetKeys(keys)} />
        <div>
          <Button onClick={onBackup} loading={loading}>Backup</Button>
          <Button onClick={onRestore} loading={loading}>Restore</Button>
        </div>
      </div>
    </Container>
  );
}

export default BackupRestore;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  text-align: right;
  height: calc(100% - 40px);

  > div:first-child {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  > div:last-child {
    height: calc(100% - 25px);
    display: flex;
    justify-content: space-between;

    > div:last-child {
      display: flex;
      flex-direction: column;

      > *:not(:first-child) {
        margin-top: 10px;
      }
    }
  }

  .ant-transfer {
    width: calc(100% - 120px);
  }

  .ant-transfer-list {
    width: 100%;
  }

  .ant-transfer, .ant-transfer-list {
    height: calc(100% - 12px);
  }
`;
