import { useState } from 'react';
import { Document, Page, Thumbnail, pdfjs } from 'react-pdf';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();

interface DocumentPreviewProps {
    file: File
}
export default function DocumentPreview({file}: DocumentPreviewProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className='w-full'>
      <Document className="h-96 md:h-[400px] w-full overflow-scroll " file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {/* <Page className="w-full" width={700} pageNumber={2} /> */}
        {/* <Thumbnail pageNumber={2}  /> */}
        {Array.apply(null, Array(numPages))
            .map((x, i)=>i+1)
            .map(page => <Thumbnail pageNumber={page} width={300} className='w-[300px]'/>)}
      </Document>
    </div>
  );
}