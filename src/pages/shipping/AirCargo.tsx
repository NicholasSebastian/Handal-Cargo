import { FC } from "react";
import styled from "styled-components";
import { Form, Input, Button, Steps } from "antd";
import TableTemplate from "../../components/compounds/TableTemplate";

const { Item } = Form;
const { Step } = Steps;

const AirCargo: FC = () => {
  return (
    <TableTemplate // TODO
      collectionName="AirCargo"
      searchBy="name"
      columns={[
        { dataIndex: "", title: "" }
      ]}
      view={props => {
        const { values } = props;
        return (
          <ViewContainer>
            {/* TODO */}
          </ViewContainer>
        );
      }}
      form={[
        { key: 'name', label: 'Nama' },
        { type: 'custom', render: () => (
          <div>test component</div>
        )}
      ]} />
  );
}

export default AirCargo;

const ViewContainer = styled.div`
  // TODO
`;
