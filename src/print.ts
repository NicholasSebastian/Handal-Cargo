import { WebviewWindow, WindowOptions } from "@tauri-apps/api/window";

type Presets = 'sf-surat-jalan-daerah' | 'sf-surat-jalan' | 'sf-faktur' | 'sf-rugi-laba'
  | 'ac-surat-jalan-daerah' | 'ac-surat-jalan' | 'ac-faktur' | 'ac-rugi-laba';

const A4_WIDTH = 210;
const A4_HEIGHT = 297;

const previewWindowConfig: WindowOptions = { 
  alwaysOnTop: true, 
  center: true, 
  focus: true, 
  resizable: false, 
  skipTaskbar: true, 
  title: "Print Preview",
  url: "print.html",
  width: A4_WIDTH * 3,
  height: A4_HEIGHT * 3
};

function print(submittedValues: any, presetName: Presets) {
  // Open a new Tauri window, displaying the data positioned for printing.
  const printview = new WebviewWindow("print-preview", previewWindowConfig);

  // Wait half a second just to make sure the window is ready before sending the values for print.
  printview.once("tauri://created", () => {
    setTimeout(() => {
      printview.emit('data', { ...submittedValues, type: presetName });
    }, 500);
  });
}

export type { Presets };
export default print;
