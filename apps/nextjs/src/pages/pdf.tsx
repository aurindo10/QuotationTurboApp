import dynamic from "next/dynamic";
import { MyDocument } from "../components/pdfPages/buyListPdf";

const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false },
);

const App = () => (
  <DynamicPDFViewer height={1500} width={800}>
    <MyDocument name="aurindo" />
  </DynamicPDFViewer>
);
export default function Page() {
  return (
    <div>
      <App></App>
    </div>
  );
}
