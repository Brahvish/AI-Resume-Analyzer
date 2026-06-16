import * as pdfjsLib from "pdfjs-dist"
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url"

// Point pdf.js at its bundled worker so parsing happens off the main thread.
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc

/**
 * Extracts plain text content from every page of a PDF file.
 * Throws a descriptive error for non-PDF files or scanned/image-only PDFs.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Please upload a valid PDF file.")
  }

  let arrayBuffer: ArrayBuffer
  try {
    arrayBuffer = await file.arrayBuffer()
  } catch {
    throw new Error("Could not read the selected file. Please try again.")
  }

  let pdf
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  } catch {
    throw new Error("This PDF could not be opened. It may be corrupted or password-protected.")
  }

  const pageTexts: string[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()

    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")

    pageTexts.push(pageText)
  }

  const fullText = pageTexts.join("\n\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim()

  if (!fullText) {
    throw new Error(
      "No readable text was found in this PDF. It may be a scanned image — please upload a text-based PDF resume."
    )
  }

  return fullText
}
