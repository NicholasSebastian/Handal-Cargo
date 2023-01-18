import { FC } from "react";
import styled from "styled-components";
import { Form, Input, Button, Steps } from "antd";
import TableTemplate from "../../components/compounds/TableTemplate";

const { Item } = Form;
const { Step } = Steps;

const SeaFreight: FC = () => {
  return (
    <TableTemplate // TODO
      collectionName="SeaFreight"
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
      form={props => {
        const { initialValues, onSubmit } = props;
        return (
          <FormContainer
            initialValues={initialValues}
            onFinish={onSubmit}
            labelCol={{ span: 7 }}>
            {/* TODO */}
          </FormContainer>
        );
      }} />
  );
}

export default SeaFreight;

const ViewContainer = styled.div`
  // TODO
`;

const FormContainer = styled(Form)`
  // TODO
`;
