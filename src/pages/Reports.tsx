import { FC } from "react";
import styled from "styled-components";
import { Card, message } from "antd";

function notify() {
  message.destroy();
  message.warn("Fitur ini masih Work in Progress.");
}

const Reports: FC = () => {
  return (
    <Container>
      <Card hoverable onClick={notify}>Surat Jalan Sea Freight</Card>
      <Card hoverable onClick={notify}>Surat Jalan Daerah Sea Freight</Card>
      <Card hoverable onClick={notify}>Faktur Sea Freight</Card>
      <Card hoverable onClick={notify}>Surat Jalan Air Cargo</Card>
      <Card hoverable onClick={notify}>Surat Jalan Daerah Air Cargo</Card>
      <Card hoverable onClick={notify}>Faktur Daerah Air Cargo</Card>
      <Card hoverable onClick={notify}>Laporan Rugi Laba Sea Freight</Card>
      <Card hoverable onClick={notify}>Laporan Rugi Laba Air Cargo</Card>
    </Container>
  );
}

export default Reports;

const Container = styled.div`
  margin: 20px;
  display: grid;
  grid-template-columns: repeat(3, 240px);
  grid-gap: 10px;

  > * {
    aspect-ratio: 1.8;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
