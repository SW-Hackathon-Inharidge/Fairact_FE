import React, { useEffect, useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import PdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?worker";

(pdfjsLib.GlobalWorkerOptions as any).workerPort = new PdfWorker();

// 타입 정의
type PositionWithPage = { x: number; y: number; page: number };

type PDFViewerProps = {
    fileUrl: string;
    markerPosition?: PositionWithPage | null;
    onPdfClick?: (x: number, y: number, pageNum: number) => void;
    ownerSignPosition?: PositionWithPage | null;
    workerSignPosition?: PositionWithPage | null;
    ownerSignUrl?: string;
    workerSignUrl?: string;
};

type PageData = {
    pageNum: number;
    viewport: any;
};

type RenderTask = {
    promise: Promise<void>;
    cancel: () => void;
};

const PDFViewer: React.FC<PDFViewerProps> = ({
    fileUrl,
    markerPosition,
    onPdfClick,
    ownerSignPosition,
    workerSignPosition,
    ownerSignUrl,
    workerSignUrl
}) => {
    const [pdfDoc, setPdfDoc] = useState<any>(null);
    const [pages, setPages] = useState<PageData[]>([]);
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
    const renderTasks = useRef<(RenderTask | null)[]>([]);

    // PDF 로드
    useEffect(() => {
        if (!fileUrl) return;

        const loadPdf = async () => {
            const loadingTask = pdfjsLib.getDocument(fileUrl);
            const loadedPdfDoc = await loadingTask.promise;
            setPdfDoc(loadedPdfDoc);

            const loadedPages: PageData[] = [];
            for (let i = 1; i <= loadedPdfDoc.numPages; i++) {
                const page = await loadedPdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                loadedPages.push({ pageNum: i, viewport });
            }
            setPages(loadedPages);
        };

        loadPdf();

        return () => {
            renderTasks.current.forEach((task) => task?.cancel());
        };
    }, [fileUrl]);

    // 페이지 렌더링
    useEffect(() => {
        if (!pdfDoc) return;

        const renderPages = async () => {
            for (let i = 0; i < pages.length; i++) {
                const { pageNum, viewport } = pages[i];
                const canvas = canvasRefs.current[i];
                if (!canvas) continue;

                const ctx = canvas.getContext("2d");
                if (!ctx) continue;

                if (renderTasks.current[i]) {
                    renderTasks.current[i]?.cancel();
                }

                try {
                    const page = await pdfDoc.getPage(pageNum);

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    const renderTask = page.render({ canvasContext: ctx, viewport });
                    renderTasks.current[i] = renderTask;

                    await renderTask.promise;
                } catch (err: any) {
                    if (err.name !== "RenderingCancelledException") {
                        console.error("PDF page render error:", err);
                    }
                }
            }
        };

        renderPages();
    }, [pdfDoc, pages]);

    // 클릭 핸들러
    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>, idx: number) => {
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        const xRatio = (e.clientX - rect.left) / rect.width;
        const yRatio = (e.clientY - rect.top) / rect.height;
        const pageNum = pages[idx]?.pageNum;
        onPdfClick?.(xRatio, yRatio, pageNum);
    };

    return (
        <div style={{ overflowY: "auto", height: "100%" }}>
            {pages.map(({ pageNum, viewport }, idx) => (
                <div
                    key={pageNum}
                    style={{
                        position: "relative",
                        marginBottom: 10,
                        width: viewport.width,
                        height: viewport.height,
                    }}
                >
                    <canvas
                        ref={(el) => {
                            canvasRefs.current[idx] = el;
                        }}
                        onClick={(e) => handleClick(e, idx)}
                        style={{
                            display: "block",
                            width: viewport.width,
                            height: viewport.height,
                        }}
                    />

                    {/* markerPosition 마커 */}
                    {markerPosition && markerPosition.page === pageNum && (
                        <div
                            style={{
                                position: "absolute",
                                left: markerPosition.x * viewport.width,
                                top: markerPosition.y * viewport.height,
                                width: 56,
                                height: 56,
                                border: "2px solid red",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                                zIndex: 10,
                            }}
                        />
                    )}
                    {ownerSignPosition && ownerSignPosition.page === pageNum && ownerSignUrl && (
                        <img
                            src={ownerSignUrl}
                            alt="Owner Signature"
                            style={{
                                position: "absolute",
                                left: ownerSignPosition.x * viewport.width,
                                top: ownerSignPosition.y * viewport.height,
                                maxWidth: 180,
                                maxHeight: 90,
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                                zIndex: 11,
                            }}
                        />
                    )}

                    {/* worker 서명 이미지 표시 */}
                    {workerSignPosition && workerSignPosition.page === pageNum && workerSignUrl && (
                        <img
                            src={workerSignUrl}
                            alt="Worker Signature"
                            style={{
                                position: "absolute",
                                left: workerSignPosition.x * viewport.width,
                                top: workerSignPosition.y * viewport.height,
                                maxWidth: 180,
                                maxHeight: 90,
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                                zIndex: 11,
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default PDFViewer;
