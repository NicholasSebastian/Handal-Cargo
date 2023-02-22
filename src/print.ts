import { WebviewWindow, WindowOptions } from "@tauri-apps/api/window";
import { once } from "@tauri-apps/api/event";
import { query as companyQuery } from "./pages/admin/CompanySetup";

type Collection = Realm.Services.MongoDB.MongoDBCollection<any> | undefined;
type Presets = 'sf-surat-jalan-daerah' | 'sf-surat-jalan' | 'sf-faktur' | 'sf-rugi-laba'
  | 'ac-surat-jalan-daerah' | 'ac-surat-jalan' | 'ac-faktur' | 'ac-rugi-laba';

// Magic numbers.
const A4_WIDTH = 792;
const A4_HEIGHT = 1120;

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
  const isLandscape = presetName.includes('rugi-laba');
  const config = previewWindowConfig(isLandscape);
  const printview = new WebviewWindow("print-preview", config);
  const company_data = await collection?.findOne(companyQuery, { projection: { _id: 0 } });
  const data = { ...submittedValues, company_data, type: presetName };

  // Send the data to the window.
  let pinger: NodeJS.Timer;
  once('data-received', () => clearInterval(pinger));
  pinger = setInterval(() => printview.emit('data', data), 100);
}

export type { Presets };
export default print;
