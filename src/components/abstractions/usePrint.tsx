import { currentMonitor, getCurrent, getAll, LogicalPosition, LogicalSize, PhysicalSize } from "@tauri-apps/api/window";
import { open } from "@tauri-apps/api/shell";
import { FC, PropsWithChildren, createContext, useContext, useState, useRef } from "react";
import styled from "styled-components";
import { Typography, Button } from "antd";
import useDatabase from "../../data/useDatabase";
import { openWhatsApp } from "../specialized/Header";
import { query as companyQuery } from "../../pages/admin/CompanySetup";
import layouts, { titles } from "../../print-layouts";

const { Title } = Typography;

// Magic numbers.
const A4_WIDTH = 792;
const A4_HEIGHT = 1120;

const currentWindow = getCurrent();
const PrintContext = createContext<Fn>(undefined);

function usePrint() {
  return useContext(PrintContext);
}

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

const PrintProvider: FC<PrintProps> = props => {
  const [open, setOpen] = useState<IData>();
  const database = useDatabase();
  const originalSize = useRef<PhysicalSize>();

  const openPrintView: Fn = async (data, preset) => {
    // Remember the original size of the window.
    originalSize.current = await currentWindow.innerSize();;

    // Figure out the size to use for the document.
    const isLandscape = preset.includes('rugi-laba');
    const width = isLandscape ? A4_HEIGHT : A4_WIDTH;
    const height = isLandscape ? A4_WIDTH : A4_HEIGHT;
    
    // Resize the window for print.
    const printSize = new LogicalSize(width, height);
    currentWindow.setSize(printSize);
    currentWindow.setResizable(false);

    // If the monitor isn't tall enough to fit the portrait-sized window, set the position explicitly.
    const monitor = await currentMonitor();
    if (monitor && !isLandscape && (height > monitor.size.height)) {
      const offsetX = (monitor.size.width - width) / 2;
      const position = new LogicalPosition(offsetX, 0);
      currentWindow.setPosition(position);
    }
    else {
      currentWindow.center();
    }

    // Set the data into the state.
    const singletons = database?.collection('Singletons');
    const company_data = await singletons?.findOne(companyQuery, { projection: { _id: 0 } });
    setOpen({ width, height, type: preset, company_data, ...data });
  }

  const closePrintView = async () => {
    // Restore the original window size before closing the print page.
    currentWindow.setSize(originalSize.current!);
    currentWindow.setResizable(true);
    currentWindow.center();
    originalSize.current = undefined;
    setOpen(undefined);
  }

  if (open) {
    const { type, ...data } = open;
    const layout = layouts[type];
    const title = titles[type];

    return (
      <Container documentWidth={open.width} documentHeight={open.height}>
        <div>
          <Button onClick={closePrintView}>Kembali</Button>
          <Title level={5}>{title}</Title>
          <div>
            <Button onClick={() => openEmailDraft(open.email)}>Buka Email</Button>
            <Button onClick={() => openWhatsAppChat()}>Buka WhatsApp</Button>
            <Button type="primary" onClick={window.print}>Print</Button>
          </div>
        </div>
        <article>
          {layout(data).map(item => {
            if ('content' in item) return (
              <span style={{
                top: `${item.y}px`,
                left: `${item.x}px`,
                color: item.color ?? '#000',
                fontSize: item.size ? `${item.size}px` : '12px',
                fontWeight: item.bold ?? 400,
                fontStyle: item.italic ? 'italic' : 'normal',
                textDecoration: item.underline ? 'underline' : 'none'
              }}>
                {item.prefix} {item.content} {item.suffix}
              </span>
            );
            return (
              <div style={{
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
  return (
    <PrintContext.Provider value={openPrintView}>
      {props.children}
    </PrintContext.Provider>
  );
}

export type { Presets };
export { PrintProvider };
export default usePrint;

const Container = styled.div<IStyleProps>`
  background-color: #f0f2f5;
  overflow-y: hidden;

  > article {
    position: relative;
    width: ${props => props.documentWidth}px;
    height: ${props => props.documentHeight}px;

    > span {
      position: fixed;
      font-family: sans-serif;
    }

    > div {
      position: fixed;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact; 
    }
  }

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

  @media screen {
    > article {
      background-color: #fff;
      border: 1px solid #d9d9d9;
      width: 100vw;
      height: 100vh;
      transform: scale(0.8);
    }
  }

  @media print {
    > div {
      display: none !important;
    }
  }

  @page {
    size: ${props => (props.documentWidth > props.documentHeight) ? "A4 landscape" : "A4"};
    margin: 0mm;
  }
`;

interface IStyleProps {
  documentWidth: number
  documentHeight: number
}

interface IData extends Record<string, any> {
  width: number
  height: number
  type: Presets
  company_data: Record<string, any>
}

type PrintProps = PropsWithChildren<{}>;
type Fn = ((values: Record<string, any>, preset: Presets) => void) | undefined;
type Presets = 'sf-surat-jalan-daerah' | 'sf-surat-jalan' | 'sf-faktur' | 'sf-rugi-laba'
  | 'ac-surat-jalan-daerah' | 'ac-surat-jalan' | 'ac-faktur' | 'ac-rugi-laba';
