import { FC, PropsWithChildren, createContext, useContext, useState } from "react";
import useDatabase from "../../data/useDatabase";
import { query as companyQuery } from "../../pages/admin/CompanySetup";
import PrintPreview from "../../pages/PrintPreview";

// Magic numbers.
const A4_WIDTH = 792;
const A4_HEIGHT = 1120;

const PrintContext = createContext<Fn>(undefined);

function usePrint() {
  return useContext(PrintContext);
}

const PrintProvider: FC<PrintProps> = props => {
  const [open, setOpen] = useState<IDocumentData>();
  const database = useDatabase();

  const openPrintView: Fn = async (data, preset) => {
    // Figure out the size to use for the document.
    const isLandscape = preset.includes('rugi-laba');
    const width = isLandscape ? A4_HEIGHT : A4_WIDTH;
    const height = isLandscape ? A4_WIDTH : A4_HEIGHT;

    // Fetch some more data for use in the print document.
    const singletons = database?.collection('Singletons');
    const company_data = await singletons?.findOne(companyQuery, { projection: { _id: 0 } });
    
    // Set the data into the state.
    setOpen({ width, height, type: preset, company_data, ...data });
  }

  if (open) return (
    <PrintPreview file={open} close={() => setOpen(undefined)} />
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
}

type PrintProps = PropsWithChildren<{}>;
type Fn = ((values: Record<string, any>, preset: Presets) => void) | undefined;
type Presets = 'sf-surat-jalan-daerah' | 'sf-surat-jalan' | 'sf-faktur' | 'sf-rugi-laba'
  | 'ac-surat-jalan-daerah' | 'ac-surat-jalan' | 'ac-faktur' | 'ac-rugi-laba';
