import { currentMonitor, getCurrent, LogicalPosition, LogicalSize, PhysicalSize } from "@tauri-apps/api/window";
import { FC, PropsWithChildren, createContext, useContext, useState, useRef } from "react";
import useDatabase, { DEFAULT_WINDOW_SIZE } from "../../data/useDatabase";
import { query as companyQuery } from "../../pages/admin/CompanySetup";
import PrintPreview from "../../pages/PrintPreview";

// Magic numbers.
const A4_WIDTH = 792;
const A4_HEIGHT = 1120;

const currentWindow = getCurrent();
const PrintContext = createContext<Fn>(undefined);

function usePrint() {
  return useContext(PrintContext);
}

const PrintProvider: FC<PrintProps> = props => {
  const [open, setOpen] = useState<IDocumentData>();
  const database = useDatabase();
  const originalSize = useRef<PhysicalSize | null>();

  const openPrintView: Fn = async (data, preset) => {
    // Remember the original size of the window.
    originalSize.current = await currentWindow.isMaximized() ? null : await currentWindow.innerSize();

    // Figure out the size to use for the document.
    const isLandscape = preset.includes('rugi-laba');
    const width = isLandscape ? A4_HEIGHT : A4_WIDTH;
    const height = isLandscape ? A4_WIDTH : A4_HEIGHT;
    
    // Resize the window for print.
    const printSize = new LogicalSize(width, height);
    currentWindow.setSize(printSize);
    currentWindow.setResizable(false);
    
    let scrollDown, scrollUp;

    // If the monitor isn't tall enough to fit the portrait-sized window, set the position explicitly.
    const currentSize = await currentWindow.outerSize();
    const monitor = await currentMonitor();
    if (monitor && !isLandscape && (currentSize.height > monitor.size.height)) {
      const offsetX = (monitor.size.width - width) / 2;
      const position = new LogicalPosition(offsetX, 0);
      currentWindow.setPosition(position);

      // And provide a function to move the window up when we need to see the bottom.
      scrollDown = async () => {
        const currentPosition = await currentWindow.outerPosition();
        const heightDifference = currentSize.height - monitor.size.height;
        const position = new LogicalPosition(currentPosition.x, -heightDifference + 15);
        await currentWindow.setPosition(position);
      }

      // And provide yet another function to move the window back down when we need to see the bottom.
      scrollUp = async () => {
        const currentPosition = await currentWindow.outerPosition();
        const position = new LogicalPosition(currentPosition.x, 0);
        await currentWindow.setPosition(position);
      }
    }
    else {
      currentWindow.center();
    }

    // Set the data into the state.
    const singletons = database?.collection('Singletons');
    const company_data = await singletons?.findOne(companyQuery, { projection: { _id: 0 } });
    setOpen({ width, height, type: preset, scrollDown, scrollUp, company_data, ...data });
  }

  const closePrintView = () => {
    // Restore the original window size.
    currentWindow.setResizable(true);

    // And the other stuff.
    if (originalSize.current === null) {
      currentWindow.setSize(DEFAULT_WINDOW_SIZE);
      currentWindow.maximize();
    }
    else if (originalSize.current !== undefined) {
      currentWindow.setSize(originalSize.current);
      currentWindow.center();
    }

    // Then close the page.
    originalSize.current = undefined;
    setOpen(undefined);
  }

  if (open) return (
    <PrintPreview file={open} close={closePrintView} />
  );
  return (
    <PrintContext.Provider value={openPrintView}>
      {props.children}
    </PrintContext.Provider>
  );
}

export type { Presets, IDocumentData };
export { PrintProvider };
export default usePrint;

interface IDocumentData extends Record<string, any> {
  width: number
  height: number
  type: Presets
  company_data: Record<string, any>
  scrollUp?: () => Promise<void>
  scrollDown?: () => Promise<void>
}

type PrintProps = PropsWithChildren<{}>;
type Fn = ((values: Record<string, any>, preset: Presets) => void) | undefined;
type Presets = 'sf-surat-jalan-daerah' | 'sf-surat-jalan' | 'sf-faktur' | 'sf-rugi-laba'
  | 'ac-surat-jalan-daerah' | 'ac-surat-jalan' | 'ac-faktur' | 'ac-rugi-laba';
