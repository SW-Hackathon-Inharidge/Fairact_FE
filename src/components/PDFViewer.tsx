import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import PdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?worker';

(pdfjsLib.GlobalWorkerOptions as any).workerPort = new PdfWorker();

type PDFViewerProps = {
    fileUrl: string;
};

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [numPages, setNumPages] = useState(0);

    useEffect(() => {
        if (!fileUrl) return;

        const loadPdf = async () => {
            const loadingTask = pdfjsLib.getDocument(fileUrl);
            const pdfDoc = await loadingTask.promise;
            setNumPages(pdfDoc.numPages);

            if (!containerRef.current) return;

            containerRef.current.innerHTML = ''; // 기존 캔버스 삭제

            for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.5 });

                // 캔버스 생성
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                canvas.style.border = '1px solid #ccc';
                canvas.style.marginBottom = '10px';

                containerRef.current.appendChild(canvas);

                // 렌더링
                await page.render({ canvasContext: ctx, viewport }).promise;
            }
        };

        loadPdf();
    }, [fileUrl]);

    return (
        <div ref={containerRef} className="space-y-3 h-full overflow-y-auto" />
    );
};

export default PDFViewer;
