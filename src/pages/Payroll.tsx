import { FC } from "react";
import styled from "styled-components";
import { Alert } from "antd";

const Payroll: FC = () => {
  return (
    <Container>
      <Alert 
        type="warning" 
        message="Fitur ini masih Work in Progress." />
      {/* TODO */}
    </Container>
  );
}

export default Payroll;

const Container = styled.div`
  margin: 20px;
  // TODO
`;
