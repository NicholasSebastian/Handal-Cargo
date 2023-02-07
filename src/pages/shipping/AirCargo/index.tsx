import { FC } from "react";
import styled from "styled-components";
import { Space, Button } from "antd";
import { FileDoneOutlined, AuditOutlined } from "@ant-design/icons";
import TableTemplate from "../../../components/compounds/TableTemplate";

const AirCargo: FC = () => {
  return (
    <TableTemplate // TODO: Refer to the SeaFreight components. They're pretty much almost identical. 
      collectionName="AirCargo"
      searchBy=""
      view={props => {
        const { values } = props;
        return (
          <ViewContainer>
            {/* TODO */}
          </ViewContainer>
        );
      }}
      form={[
        { key: 'name', label: 'Nama' }
      ]}
      columns={[
        { dataIndex: "", title: "" }
      ]}
      extra={
        <Space>
          <Button icon={<FileDoneOutlined />}>Surat Jalan</Button>
          <Button icon={<AuditOutlined />}>Faktur</Button>
        </Space>
      } />
  );
}

export default AirCargo;

const ViewContainer = styled.div`
  // TODO
`;
