import { open } from "@tauri-apps/api/shell";
import { ReactNode } from "react";
import styled from "styled-components";
import { Timeline } from "antd";

const { Item } = Timeline;

// Intended for use within the Sider component.

const REPOSITORY_URL_V8 = 'https://github.com/NicholasSebastian/Handal-Cargo';
const REPOSITORY_URL_V7 = 'https://github.com/NicholasSebastian/Handal-Cargo-Office';
const REPOSITORY_URL_V6 = 'https://github.com/NicholasSebastian/HandalCargo-ERP';
const REPOSITORY_URL_V5 = 'https://github.com/NicholasSebastian/HandalCargo-v5';
const REPOSITORY_URL_V4 = 'https://github.com/NicholasSebastian/HandalCargo-v4';
const REPOSITORY_URL_V3 = 'https://github.com/NicholasSebastian/HandalCargo-v3';
const REPOSITORY_URL_V2 = 'https://github.com/NicholasSebastian/Handal-ERP-v2';
const REPOSITORY_URL_V1 = 'https://github.com/NicholasSebastian/Handal-Cargo-ERP';

const Description = styled.dl`
  dt {
    margin-top: 16px;
  }

  .ant-timeline {
    padding-top: 6px;
    margin-bottom: -10px;
    font-family: monospace;

    .ant-timeline-item, .ant-timeline-item-content {
      padding-top: 2px;
      padding-bottom: 0;
      min-height: 0;
    }
  }
`;

const description: ReactNode = (
  <Description>
    <dt>This product is made for:</dt>
    <dd>PT. Handal Cargo</dd>
    <dt>Developer Credits</dt>
    <dd>
      Nicholas Sebastian Hendrata<br />
      Jacky Richie Bahary
    </dd>
    <dt>Version History</dt>
    <dd>
      <Timeline>
        <Item color="green">
          18/02/2023 -&nbsp;
          <a onClick={() => open(REPOSITORY_URL_V8)}>
            Version 8.0.0
          </a>
        </Item>
        <Item color="red">
          17/04/2022 -&nbsp;
          <a onClick={() => open(REPOSITORY_URL_V7)}>
            Version 7.0.0
          </a>
        </Item>
        <Item color="gray">
          28/01/2022 -&nbsp;
          <a onClick={() => open(REPOSITORY_URL_V6)}>
            Version 6.0.0
          </a>
        </Item>
        <Item color="gray">
          03/07/2021 -&nbsp;
          <a onClick={() => open(REPOSITORY_URL_V5)}>
            Version 5.0.0
          </a>
        </Item>
        <Item color="gray">
          24/01/2021 -&nbsp;
          <a onClick={() => open(REPOSITORY_URL_V4)}>
            Version 4.0.0
          </a>
        </Item>
        <Item color="gray">
          09/01/2021 -&nbsp;
          <a onClick={() => open(REPOSITORY_URL_V3)}>
            Version 3.0.0
          </a>
        </Item>
        <Item color="gray">
          21/12/2020 -&nbsp;
          <a onClick={() => open(REPOSITORY_URL_V2)}>
            Version 2.0.0
          </a>
        </Item>
        <Item color="gray">
          09/10/2020 -&nbsp;
          <a onClick={() => open(REPOSITORY_URL_V1)}>
            Version 1.0.0
          </a>
        </Item>
      </Timeline>
    </dd>
  </Description>
);

export default description;
