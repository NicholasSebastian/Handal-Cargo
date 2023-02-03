import { FC } from "react";
import styled from "styled-components";

const Lookup: FC = () => {
  return (
    <Container 
      src="https://kursdollar.org/mata-uang/CNY/"
      title="Exchange Rates" />
  );
}

export default Lookup;

const Container = styled.iframe`
  width: 100%;
  height: calc(100% - 6px);
  border: none;
`;
