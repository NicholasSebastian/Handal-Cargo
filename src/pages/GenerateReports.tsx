import { FC } from "react";
import styled from "styled-components";
import { Alert } from "antd";

const GenerateReports: FC = () => {
  return (
    <Container>
      <Alert 
        type="warning" 
        message="Fitur ini telah dibatalkan." />
      {/* TODO */}
    </Container>
  );
}

export default GenerateReports;

const Container = styled.div`
  margin: 20px;
  // TODO
`;