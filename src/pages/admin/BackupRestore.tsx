import { open } from '@tauri-apps/api/shell';
import { writeFile, readTextFile } from "@tauri-apps/api/fs";
import { open as select, save, SaveDialogOptions } from '@tauri-apps/api/dialog';
import { FC, useState, useRef } from "react";
import styled from "styled-components";
import { Button, Alert, Transfer, Modal, Progress, message } from "antd";
import useDatabase from "../../data/useDatabase";

const MONGODB_ATLAS_URL = "https://cloud.mongodb.com/";

// This should list all the collections in the database.
const collections = [
  "AccessLevels",
  "AirCargo",
  "Carriers",
  "ContainerGroups",
  "Currencies",
  "Customers",
  "Expeditions",
  "Handlers",
  "Invoices",
  "Payments",
  "Planes",
  "ProductDetails",
  "Routes",
  "SeaFreight",
  "Singletons",
  "Staff",
  "StaffGroups"
];

const BackupRestore: FC = () => {
  const database = useDatabase();
  const [targetKeys, setTargetKeys] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<string>();
  const [progress, setProgress] = useState(0);
  const progressMax = useRef(0);

  const onBackup = () => {
    // Prepare the modal to display the progress bar.
    progressMax.current = targetKeys.length;
    setLoading(true);

    // Get all the data from the selected collections.
    Promise.all(targetKeys.map(collection => database?.collection(collection).find()
      .then(data => {
        // Increment the progress bar.
        setProgress(progress => progress + 1);
        setCurrent(collection);
        return { collection, data } as IBackupData;
      }))
    )
    // Save the data into a file.
    .then(results => save(options)
      .then(filepath => ({ filepath, data: JSON.stringify(results) }))
    )
    .then(response => writeFile({ path: response.filepath, contents: response.data }))

    // User feedback.
    .then(() => message.success("Backup data berhasil disimpan."))
    .catch(() => message.error("Error terjadi ketika mengunduh backup data."))
    .finally(() => {
      // Hide the modal and reset the progress bar.
      setLoading(false);
      setCurrent(undefined);
      setProgress(0);
      progressMax.current = 0;
    });
  }

  const onRestore = () => {
    // Choose a file and read the data from it.
    select(options)
      .then(filepath => {
        if (filepath) return readTextFile(filepath as string);
        else throw new Error();
      })
      .catch(() => message.error("Error terjadi ketika membaca backup data."))
      .then(contents => {
        const data = JSON.parse(contents);

        // Prepare the modal to display the progress bar.
        progressMax.current = data.length;
        setLoading(true);

        // Replace the data's associated collections with our own.
        return Promise.all(data.map((item: IBackupData) => 
          database?.collection(item.collection).deleteMany({})
            .then(() => database.collection(item.collection).insertMany(item.data))
            .then(() => {
              // Increment the progress bar.
              setCurrent(item.collection);
              setProgress(progress + 1);
          })))
          // User feedback.
          .then(() => message.success(`${data.length} koleksi telah diubah.`))
          .catch(() => message.error("Error terjadi ketika mengupload backup data."));
      })
      .finally(() => {
        // Hide the modal and reset the progress bar.
        setLoading(false);
        setCurrent(undefined);
        setProgress(0);
        progressMax.current = 0;
      });
  }

  return (
    <Container>
      <div>
        <Alert showIcon 
          type="info" 
          message="Tanya Nico atau Ifat kalau perlu bantuan." />
        <Button 
          type="primary" 
          onClick={() => open(MONGODB_ATLAS_URL)}>
          Dasbor Database
        </Button>
      </div>
      <Modal centered 
        visible={loading}
        footer={null}
        closable={false} 
        maskClosable={false} >
        {current && `Processing ${current}...`}
        <Progress 
          percent={Math.round((progress / progressMax.current) * 100)} 
          status='active' />
      </Modal>
      <div>
        <Transfer oneWay
          titles={['Semua', 'Akan di Backup']}
          dataSource={collections.map(collection => ({ key: collection, title: collection }))}
          render={item => item.title}
          operations={['Include']}
          targetKeys={targetKeys}
          onChange={keys => setTargetKeys(keys)} />
        <div>
          <Button onClick={onBackup}>Backup</Button>
          <Button onClick={onRestore}>Restore</Button>
        </div>
      </div>
    </Container>
  );
}

const options: SaveDialogOptions = {
  filters: [{
    name: 'JSON File',
    extensions: ['json']
  }]
};

export default BackupRestore;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;
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
    width: calc(100% - 100px);
  }

  .ant-transfer-list {
    width: 100%;
  }

  .ant-transfer, .ant-transfer-list {
    height: calc(100% - 12px);
  }
`;

interface IBackupData {
  collection: string
  data: Array<any>
}
