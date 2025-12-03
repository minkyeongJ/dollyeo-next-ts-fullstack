"use client";

import { useCallback, useState } from "react";

interface PDFExportOptions {
  title?: string;
  filename?: string;
}

interface PDFExportResult {
  isExporting: boolean;
  error: string | null;
  exportToPDF: (content: string, options?: PDFExportOptions) => Promise<void>;
}

/**
 * PDF 내보내기를 위한 커스텀 훅
 */
export function usePDFExport(): PDFExportResult {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPDF = useCallback(
    async (content: string, options?: PDFExportOptions) => {
      setIsExporting(true);
      setError(null);

      try {
        const { title = "룰렛 결과", filename = "roulette-result" } =
          options ?? {};

        // 브라우저 print API를 사용한 간단한 PDF 내보내기
        const printWindow = window.open("", "_blank");

        if (!printWindow) {
          throw new Error("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
        }

        const htmlContent = `
          <!DOCTYPE html>
          <html lang="ko">
          <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
              body {
                font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
                padding: 40px;
                max-width: 800px;
                margin: 0 auto;
              }
              h1 {
                color: #4F46E5;
                border-bottom: 2px solid #4F46E5;
                padding-bottom: 10px;
              }
              .content {
                margin-top: 20px;
                line-height: 1.6;
              }
              .timestamp {
                color: #6B7280;
                font-size: 14px;
                margin-top: 30px;
              }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div class="content">${content}</div>
            <p class="timestamp">생성일: ${new Date().toLocaleString("ko-KR")}</p>
          </body>
          </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // 문서 로드 후 인쇄
        printWindow.onload = () => {
          printWindow.print();
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "PDF 내보내기에 실패했습니다.";
        setError(errorMessage);
        console.error("PDF 내보내기 오류:", err);
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    isExporting,
    error,
    exportToPDF,
  };
}

