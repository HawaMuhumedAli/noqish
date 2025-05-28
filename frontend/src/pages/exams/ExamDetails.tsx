import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useExamById } from "../../hooks/useExams";
import html2pdf from "html2pdf.js";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Download,
  FileText,
  RefreshCw,
  Info,
  List,
  ChevronDown,
  ChevronUp,
  Eye,
  Columns,
} from "lucide-react";

interface Question {
  _id: string;
  text: string;
  options?: string[];
}

interface Exam {
  _id: string;
  title: string;
  description: string;
  shuffleQuestions: boolean;
  trueFalseQuestions: Question[];
  multipleChoiceQuestions: Question[];
  directQuestions: Question[];
}

export default function ExamDetails() {
  const { examId = "" } = useParams();
  const { data: exam, isLoading } = useExamById(examId);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [versionCount, setVersionCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    trueFalse: true,
    multipleChoice: true,
    direct: true,
  });
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [comparisonVersions, setComparisonVersions] = useState<
    [string, string]
  >(["", ""]);

  const shuffleArray = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const generatePdfContent = (
    questions: Record<string, Question[]>,
    versionLabel: string
  ) => {
    const logoUrl = "https://www.just.edu.so/assets/images/logo.png";
    const institutionName = "NoQish Platform";
    const departmentName = "Department of Computer Science";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @page { margin: 20mm; }
            body { 
              font-family: 'Helvetica Neue', Arial, sans-serif; 
              font-size: 11pt;
              line-height: 1.6;
              color: #333;
              padding: 0;
              margin: 0;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-bottom: 1.5rem;
              padding-bottom: 1rem;
              border-bottom: 1px solid #e2e8f0;
            }
            .logo-container {
              display: flex;
              align-items: center;
              gap: 1rem;
            }
            .logo {
              height: 50px;
            }
            .institution-info {
              text-align: right;
            }
            .exam-title {
              font-size: 1.4rem;
              font-weight: 600;
              color: #1a365d;
              margin: 1.5rem 0 0.5rem;
              text-align: center;
            }
            .exam-meta {
              display: flex;
              justify-content: space-between;
              margin-bottom: 1.5rem;
              font-size: 0.9rem;
              color: #4a5568;
            }
            .section {
              margin: 2rem 0;
              page-break-inside: avoid;
            }
            .section-title {
              font-size: 1.1rem;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 1rem;
              padding-bottom: 0.3rem;
              border-bottom: 1px solid #cbd5e0;
            }
            ol { 
              margin-left: 1.5rem;
              padding-left: 0;
            }
            ol li {
              margin-bottom: 1rem;
              position: relative;
            }
            ol li:before {
              content: attr(data-number) ".";
              font-weight: 600;
              color: #4a5568;
              position: absolute;
              left: -1.5rem;
            }
            ul {
              margin: 0.5rem 0 0 1.5rem;
              padding-left: 1rem;
            }
            ul li {
              position: relative;
              margin-bottom: 0.3rem;
            }
            ul li:before {
              content: "•";
              position: absolute;
              left: -0.7rem;
              color: #718096;
            }
            .watermark {
              opacity: 0.05;
              position: fixed;
              bottom: 30%;
              right: 20%;
              font-size: 72px;
              transform: rotate(-30deg);
              pointer-events: none;
              color: #1a365d;
              font-weight: bold;
            }
            .page-break {
              page-break-after: always;
            }
            .instructions {
              font-size: 0.9rem;
              color: #4a5568;
              margin-bottom: 1.5rem;
              padding: 0.5rem;
              background-color: #f7fafc;
              border-left: 3px solid #4299e1;
            }
            .version-badge {
              position: absolute;
              top: 10px;
              right: 10px;
              background: #1a365d;
              color: white;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 0.8rem;
            }
          </style>
        </head>
        <body>
          <div class="version-badge">Version ${versionLabel}</div>
          <div class="header">
            <div class="logo-container">
              <img src="${logoUrl}" alt="Logo" class="logo" />
              <div>
                <div style="font-weight: 600;">${institutionName}</div>
                <div style="font-size: 0.9rem;">${departmentName}</div>
              </div>
            </div>
            <div class="institution-info">
              <div>Date: ${new Date().toLocaleDateString()}</div>
              <div>Exam Code: ${examId.slice(-4).toUpperCase()}</div>
            </div>
          </div>

          <div class="watermark">${versionLabel}</div>

          <h1 class="exam-title">${exam?.title}</h1>
          <div class="exam-meta">
            <div>Time Allowed: 2 hours</div>
            <div>Total Marks: 100</div>
          </div>
          <div class="instructions">
            <strong>Instructions:</strong> Answer all questions. Write your answers clearly in the spaces provided.
          </div>

          ${Object.entries(questions)
            .map(
              ([sectionName, items], idx) => `
            <div class="section">
              <h2 class="section-title">Section ${idx + 1}: ${sectionName}</h2>
              <ol>${items
                .map(
                  (q, qIndex) => `
                <li data-number="${qIndex + 1}">
                  ${q.text}
                  ${
                    q.options
                      ? `
                    <ul>${q.options
                      .map(
                        (opt, i) => `
                      <li>${String.fromCharCode(97 + i)}) ${opt}</li>
                    `
                      )
                      .join("")}</ul>
                  `
                      : ""
                  }
                </li>
              `
                )
                .join("")}</ol>
            </div>
            ${
              idx < Object.keys(questions).length - 1
                ? '<div class="page-break"></div>'
                : ""
            }
          `
            )
            .join("")}
        </body>
      </html>
    `;
  };

  const generateRandomVersion = () => {
    if (!exam) return "";

    const questions = {
      "True/False Questions": exam.shuffleQuestions
        ? shuffleArray([...exam.trueFalseQuestions])
        : [...exam.trueFalseQuestions],
      "Multiple Choice Questions": exam.shuffleQuestions
        ? shuffleArray([...exam.multipleChoiceQuestions])
        : [...exam.multipleChoiceQuestions],
      "Direct Questions": exam.shuffleQuestions
        ? shuffleArray([...exam.directQuestions])
        : [...exam.directQuestions],
    };

    return generatePdfContent(
      questions,
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    );
  };

  const generatePreview = () => {
    const html = generateRandomVersion();
    setPreviewHtml(html);
    setShowPreviewModal(true);
  };

  const generateComparison = () => {
    setComparisonMode(true);
    setComparisonVersions([generateRandomVersion(), generateRandomVersion()]);
  };

  const handleDownloadPDF = () => {
    if (!pdfRef.current || !exam) return;

    const opt = {
      margin: 10,
      filename: `${exam.title}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, logging: true, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf().set(opt).from(pdfRef.current).save();
  };

  const handleGenerateMultipleVersions = async () => {
    if (!exam) return;
    setIsGenerating(true);
    const zip = new JSZip();
    const versionLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < versionCount; i++) {
      const questions = {
        "True/False Questions": exam.shuffleQuestions
          ? shuffleArray([...exam.trueFalseQuestions])
          : [...exam.trueFalseQuestions],
        "Multiple Choice Questions": exam.shuffleQuestions
          ? shuffleArray([...exam.multipleChoiceQuestions])
          : [...exam.multipleChoiceQuestions],
        "Direct Questions": exam.shuffleQuestions
          ? shuffleArray([...exam.directQuestions])
          : [...exam.directQuestions],
      };

      const htmlContent = generatePdfContent(questions, versionLabels[i]);

      const blob: Blob = await html2pdf()
        .from(htmlContent)
        .set({
          margin: 10,
          filename: `version-${versionLabels[i]}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .output("blob");

      zip.file(`version-${versionLabels[i]}.pdf`, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, `${exam.title}-versions.zip`);
    setIsGenerating(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!exam)
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg">
        Exam not found
      </div>
    );

  const tfQs = exam.shuffleQuestions
    ? shuffleArray([...exam.trueFalseQuestions])
    : [...exam.trueFalseQuestions];
  const mcQs = exam.shuffleQuestions
    ? shuffleArray([...exam.multipleChoiceQuestions])
    : [...exam.multipleChoiceQuestions];
  const directQs = exam.shuffleQuestions
    ? shuffleArray([...exam.directQuestions])
    : [...exam.directQuestions];

  const renderControls = () => (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={handleDownloadPDF}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download size={18} className="mr-2" />
        Download PDF
      </button>

      <button
        onClick={generatePreview}
        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        <Eye size={18} className="mr-2" />
        Preview Random Version
      </button>

      <button
        onClick={generateComparison}
        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Columns size={18} className="mr-2" />
        Compare Versions
      </button>

      <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Versions:
        </label>
        <input
          type="number"
          min={1}
          max={26}
          value={versionCount}
          onChange={(e) =>
            setVersionCount(Math.min(26, Math.max(1, +e.target.value || 1)))
          }
          className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
        />
        <button
          onClick={handleGenerateMultipleVersions}
          disabled={isGenerating}
          className="flex items-center px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <RefreshCw size={16} className="animate-spin mr-2" />
          ) : (
            <FileText size={16} className="mr-2" />
          )}
          Generate
        </button>
      </div>
    </div>
  );

  const PreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {comparisonMode ? "Version Comparison" : "PDF Preview"}
          </h3>
          <button
            onClick={() => {
              setShowPreviewModal(false);
              setComparisonMode(false);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {comparisonMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded p-2">
                <div className="text-center font-medium mb-2">Version A</div>
                <iframe
                  srcDoc={comparisonVersions[0]}
                  className="w-full h-[70vh] border rounded"
                  title="Version A"
                />
              </div>
              <div className="border rounded p-2">
                <div className="text-center font-medium mb-2">Version B</div>
                <iframe
                  srcDoc={comparisonVersions[1]}
                  className="w-full h-[70vh] border rounded"
                  title="Version B"
                />
              </div>
            </div>
          ) : (
            <iframe
              srcDoc={previewHtml}
              className="w-full h-[70vh] border rounded"
              title="PDF Preview"
            />
          )}
        </div>
        <div className="p-4 border-t flex justify-between">
          <div>
            {comparisonMode && (
              <button
                onClick={() =>
                  setComparisonVersions([
                    generateRandomVersion(),
                    generateRandomVersion(),
                  ])
                }
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                <RefreshCw size={16} className="mr-2 inline" />
                Regenerate Both
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {!comparisonMode && (
              <button
                onClick={generatePreview}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                <RefreshCw size={16} className="mr-2 inline" />
                New Random Version
              </button>
            )}
            <button
              onClick={() => {
                const blob = new Blob(
                  [comparisonMode ? comparisonVersions[0] : previewHtml],
                  { type: "text/html" }
                );
                saveAs(
                  blob,
                  `exam-${
                    comparisonMode ? "comparison" : "preview"
                  }-${Date.now()}.html`
                );
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Download size={16} className="mr-2 inline" />
              Download HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
          {exam.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {exam.description}
        </p>
      </div>

      {/* Controls */}
      {renderControls()}

      {/* Exam Preview */}
      <div
        ref={pdfRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* True/False Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => toggleSection("trueFalse")}
            className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                <List className="w-4 h-4 text-green-600 dark:text-green-300" />
              </div>
              <h2 className="text-lg font-semibold">True/False Questions</h2>
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                {tfQs.length} questions
              </span>
            </div>
            {expandedSections.trueFalse ? (
              <ChevronUp className="text-gray-500" />
            ) : (
              <ChevronDown className="text-gray-500" />
            )}
          </button>
          {expandedSections.trueFalse && (
            <div className="p-4 pt-0">
              <ol className="space-y-4">
                {tfQs.map((q, index) => (
                  <li key={q._id || index} className="flex">
                    <div className="flex-shrink-0 w-6 h-6 mt-1 mr-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}.
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 dark:text-gray-200">
                        {q.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Multiple Choice Section */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => toggleSection("multipleChoice")}
            className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                <List className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              </div>
              <h2 className="text-lg font-semibold">
                Multiple Choice Questions
              </h2>
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                {mcQs.length} questions
              </span>
            </div>
            {expandedSections.multipleChoice ? (
              <ChevronUp className="text-gray-500" />
            ) : (
              <ChevronDown className="text-gray-500" />
            )}
          </button>
          {expandedSections.multipleChoice && (
            <div className="p-4 pt-0">
              <ol className="space-y-6">
                {mcQs.map((q, index) => (
                  <li key={q._id || index} className="flex">
                    <div className="flex-shrink-0 w-6 h-6 mt-1 mr-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}.
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 dark:text-gray-200 mb-2">
                        {q.text}
                      </p>
                      <ul className="space-y-2">
                        {q.options?.map((opt, optIndex) => (
                          <li key={optIndex} className="flex items-start">
                            <span className="inline-block w-5 text-sm text-gray-500 dark:text-gray-400">
                              {String.fromCharCode(97 + optIndex)})
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {opt}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Direct Questions Section */}
        <div>
          <button
            onClick={() => toggleSection("direct")}
            className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-3">
                <List className="w-4 h-4 text-orange-600 dark:text-orange-300" />
              </div>
              <h2 className="text-lg font-semibold">Direct Questions</h2>
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                {directQs.length} questions
              </span>
            </div>
            {expandedSections.direct ? (
              <ChevronUp className="text-gray-500" />
            ) : (
              <ChevronDown className="text-gray-500" />
            )}
          </button>
          {expandedSections.direct && (
            <div className="p-4 pt-0">
              <ol className="space-y-4">
                {directQs.map((q, index) => (
                  <li key={q._id || index} className="flex">
                    <div className="flex-shrink-0 w-6 h-6 mt-1 mr-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                      {index + 1}.
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 dark:text-gray-200">
                        {q.text}
                      </p>
                      <div className="mt-4 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-400">
                        Answer space
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {showPreviewModal && <PreviewModal />}
    </div>
  );
}
