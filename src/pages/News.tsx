import { FC } from "react";
import styled from "styled-components";

const News: FC = () => {
  return (
    <Container 
      src="https://news.detik.com/"
      title="News" />
  );
}

export default News;

const Container = styled.iframe`
  width: 100%;
  height: calc(100% - 6px);
  border: none;
`;
