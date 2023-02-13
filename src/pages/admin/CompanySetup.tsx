import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Card, Modal, message } from "antd";
import { BSON } from "realm-web";
import useDatabase from "../../data/useDatabase";
import BasicView from "../../components/basics/BasicView";
import BasicForm from "../../components/basics/BasicForm";
import { ModalStyles } from "../../components/compounds/TableTemplate";

// The id of the document containing the CompanySetup data.
const query = { _id: new BSON.ObjectId('63cf962885e64997d6cc706f')};

// Defines both the view and form items.
const items = [
  { key: 'name', label: 'Nama Perusahaan' },
  { key: 'address', label: 'Alamat' },
  { key: 'city', label: 'Kota' },
  { key: 'zip_code', label: 'Kode Zip' },
  { key: 'phone_number', label: 'Nomor Telepon' },
  { key: 'fax', label: 'Fax' },
  { key: 'email', label: 'Email' }
];

const CompanySetup: FC = () => {
  const database = useDatabase();
  const [values, setValues] = useState<any>({});
  const [modal, setModal] = useState(false);

  // Fetches the CompanySetup data and updates the state.
  const refreshData = () => {
    database?.collection("Singletons")
      .findOne(query)
      .then(result => setValues(result));
  }

  // Sets the values into the database and refresh the state on form submit.
  const handleUpdate = (values: any) => {
    database?.collection("Singletons")
      .updateOne(query, values)
      .then(() => {
        message.success("Detail Perusahaan telah diubah.");
        setModal(false);
        refreshData();
      })
      .catch(() => message.error("Error terjadi ketika mengubah detail perusahaan."));
  }

  // Fetch the data at the beginning.
  useEffect(refreshData, []);

  return (
    <Container>
      <Button 
        type="primary"
        onClick={() => setModal(true)}>
        Edit Detail Perusahaan
      </Button>
      <div>
        <BasicView
          items={items}
          values={values} />
        {values.via_transfer && (
          <Card title="Via Transfer">
            <pre>{values.via_transfer}</pre>
          </Card>
        )}
      </div>
      <Modal centered maskClosable
        title="Edit Detail Perusahaan"
        visible={modal}
        onCancel={() => setModal(false)}
        footer={null}
        width={600}
        bodyStyle={ModalStyles}>
        <BasicForm
          initialValues={values}
          onSubmit={values => handleUpdate(values)}
          items={[
            ...items,
            { key: 'via_transfer', label: 'Via Transfer', type: 'textarea', required: false }
          ]} />
      </Modal>
    </Container>
  );
}

export default CompanySetup;

const Container = styled.div`
  background-color: #fff;
  margin: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;

  > button:first-child {
    margin-bottom: 10px;
    align-self: flex-end;
  }

  > div:first-of-type {
    display: flex;
    align-items: flex-start;

    > div:last-child {
      margin-left: 20px;
    }
  }
`;
