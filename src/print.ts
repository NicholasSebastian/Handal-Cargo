import { WebviewWindow, WindowOptions } from "@tauri-apps/api/window";
import { query as companyQuery } from "./pages/admin/CompanySetup";

type Collection = Realm.Services.MongoDB.MongoDBCollection<any> | undefined;
type Presets = 'sf-surat-jalan-daerah' | 'sf-surat-jalan' | 'sf-faktur' | 'sf-rugi-laba'
  | 'ac-surat-jalan-daerah' | 'ac-surat-jalan' | 'ac-faktur' | 'ac-rugi-laba';

const A4_WIDTH = 210 * 3;
const A4_HEIGHT = 297 * 3;

const previewWindowConfig = (landscape: boolean): WindowOptions => ({ 
  alwaysOnTop: true, 
  center: true, 
  focus: true, 
  resizable: false, 
  skipTaskbar: true, 
  title: "Print Preview",
  url: "print.html",
  width: landscape ? A4_HEIGHT : A4_WIDTH,
  height: landscape ? A4_WIDTH : A4_HEIGHT
});

async function print(submittedValues: any, presetName: Presets, collection: Collection) {
  // Open a new Tauri window, displaying the data positioned for printing.
  const config = previewWindowConfig(presetName.includes('rugi-laba'));
  const printview = new WebviewWindow("print-preview", config);
  const company_data = await collection?.findOne(companyQuery, { projection: { _id: 0 } });

  // Wait half a second just to make sure the window is ready before sending the values for print.
  printview.once("tauri://created", () => {
    setTimeout(() => {
      printview.emit('data', { ...submittedValues, company_data, type: presetName });
    }, 600);
  });
}

export type { Presets };
export default print;
