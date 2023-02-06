import { useState, useMemo, ReactNode } from "react";
import styled from "styled-components";
import { Form, Button, Steps } from "antd";
import { FormItem, RenderItem } from "../basics/BasicForm";

const { Item } = Form;
const { Step } = Steps;

// Intended for use within the BasicForm component.

function usePageHandling(formItems: Array<FormItem>, customButton: ReactNode) {
  const [currentPage, setCurrentPage] = useState(0);

  // Separate the form items by page into multiple arrays.
  const pages = useMemo(() => formItems.reduce((accumulator: Array<Array<RenderItem>>, item) => {
    if (item === 'pagebreak') accumulator.push([]);
    else accumulator.at(-1)?.push(item);
    return accumulator;
  }, [[]]), [formItems]);

  // Conditional steps component to be placed at the top the form.
  const steps = (pages.length > 1) ? (
    <StepsContainer
      size="small"
      current={currentPage}
      onChange={i => setCurrentPage(i)}>
      {pages.map((_, i) => <Step key={i} />)}
    </StepsContainer>
  ) : undefined;

  // Conditional button compnents to be placed at the bottom of the form.
  const buttons = (
    <ButtonsContainer>
      {(currentPage > 0) && (
        <Button 
          type="primary" 
          htmlType="button" 
          onClick={() => setCurrentPage(page => page - 1)}>
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
        customButton ?? (
          <Button 
            type="primary" 
            htmlType="submit">
            Simpan
          </Button>
        )
      )}
    </ButtonsContainer>
  );

  return { currentPage, pages, steps, buttons };
}

export default usePageHandling;

const StepsContainer = styled(Steps)`
  padding-top: 0;
  margin-bottom: 30px;
`;

const ButtonsContainer = styled(Item)`
  margin-top: 10px;

  button:not(:last-child) {
    margin-right: 10px;
  }
`;
