import { useState, useMemo } from "react";
import styled from "styled-components";
import { Form, Button, Steps } from "antd";
import { FormItem, RenderItem } from "../basics/BasicForm";

const { Item } = Form;
const { Step } = Steps;

function usePageHandling(formItems: Array<FormItem>) {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = useMemo(() => formItems.reduce((accumulator: Array<Array<RenderItem>>, item) => {
    if (item === 'pagebreak') accumulator.push([]);
    else accumulator.at(-1)?.push(item);
    return accumulator;
  }, [[]]), [formItems]);

  const steps = (pages.length > 1) ? (
    <StepsContainer
      size="small"
      current={currentPage}
      onChange={i => setCurrentPage(i)}>
      {pages.map((_, i) => <Step key={i} />)}
    </StepsContainer>
  ) : undefined;

  const buttons = (
    <Item>
      {(currentPage > 0) && (
        <Button 
          type="primary" 
          htmlType="button" 
          onClick={() => setCurrentPage(page => page - 1)} 
          style={{ marginRight: 10 }}>
          Kembali
        </Button>
      )}
      {(currentPage < pages.length - 1) && (
        <Button 
          type="primary" 
          htmlType="button" 
          onClick={() => setCurrentPage(page => page + 1)}>
          Berikut
        </Button>
      )}
      {(currentPage === pages.length - 1) && (
        <Button 
          type="primary" 
          htmlType="submit">
          Simpan
        </Button>
      )}
    </Item>
  );

  return { currentPage, pages, steps, buttons };
}

export default usePageHandling;

const StepsContainer = styled(Steps)`
  padding-top: 0;
  margin-bottom: 30px;
`;
