import { getAll } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/api/shell";
import { FC } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Typography, Button } from "antd";
import { IDocumentData } from "../components/abstractions/usePrint";
import { openWhatsApp } from "../components/specialized/Header";
import layouts, { titles } from "../print-layouts";

const { Title } = Typography;

function openEmailDraft(email: string | undefined) {
  open(email ? `mailto:${email}` : 'mailto:');
}

function openWhatsAppChat() {
  const whatsappWindow = getAll().find(window => window.label === 'whatsapp-window');
  if (whatsappWindow) 
    whatsappWindow.setFocus();
  else 
    openWhatsApp();
}

const PrintPreview: FC<IPrintPreviewProps> = props => {
  const { file, close } = props;
  const { type, width, height, ...data } = file;
  const layout = layouts[type];
  const title = titles[type];

  return (
    <Container 
      documentWidth={width} 
      documentHeight={height}>
      <PageRules isLandscape={width > height} />
      <div>
        <Button onClick={close}>Kembali</Button>
        <Title level={5}>{title}</Title>
        <div>
          <Button onClick={() => openEmailDraft(data.email)}>Buka Email</Button>
          <Button onClick={() => openWhatsAppChat()}>Buka WhatsApp</Button>
          <Button type="primary" onClick={window.print}>Print</Button>
        </div>
      </div>
      <article>
        {layout(data).map((item, i) => {
          if ('content' in item) return (
            <span 
              key={i}
              style={{
                top: `${item.y}px`,
                left: `${item.x}px`,
                color: item.color ?? '#000',
                fontSize: item.size ? `${item.size}px` : '16px',
                fontWeight: item.bold ?? 800,
                fontStyle: item.italic ? 'italic' : 'normal',
                textDecoration: item.underline ? 'underline' : 'none'
              }}>
              {item.prefix} {item.preserve ? <pre>{item.content}</pre> : item.content?.toString()} {item.suffix}
            </span>
          );
          return (
            <div 
              key={i}
              style={{
                backgroundColor: item.color ?? '#004D52',
                top: `${item.y}px`,
                left: `${item.x}px`,
                width: `${item.width}px`,
                height: `${item.height}px`
              }} />
          );
        })}
      </article>
    </Container>
  );
}

export default PrintPreview;

const PageRules = createGlobalStyle<IRulesProps>`
  @page {
    size: ${props => props.isLandscape ? "A4 landscape" : "A4"};
    margin: 0mm;
  }
`;

const Container = styled.div<IStyleProps>`
  background-color: #f0f2f5;
  overflow-y: hidden;

  // The print document.
  > article {
    position: relative;

    // Texts within the print document.
    > span {
      position: fixed;
      font-family: Courier New;

      > pre {
        line-height: 15px;
      }
    }

    // Rects within the print document.
    > div {
      position: fixed;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact; 
    }
  }

  // The menu bar at the top.
  > div {
    background-color: #fff;
    border-bottom: 1px solid #d9d9d9;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    > h5 {
      margin: 0;
    }

    > div:last-child > button {
      margin-left: 10px;
    }
  }

  // Make the print document presentable on the screen.
  @media screen {
    > article {
      background-color: #fff;
      width: ${props => props.documentWidth}px;
      height: ${props => props.documentHeight}px;
      border: 1px solid #d9d9d9;
      margin: 0 auto;
      transform: scale(0.8);
    }
  }

  // Hide the menu during print.
  @media print {
    > div {
      display: none !important;
    }
  }
`;

interface IPrintPreviewProps {
  file: IDocumentData
  close: () => void
}

interface IRulesProps {
  isLandscape: boolean
}

interface IStyleProps {
  documentWidth: number
  documentHeight: number
}
