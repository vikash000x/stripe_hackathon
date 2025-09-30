// src/utils/parseResume.ts
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";  // 👈 this line is the magic

// ✅ Tell pdf.js where the worker file is
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// Define the type for parsed resume data
export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
}

export async function parseResume(file: File): Promise<ParsedResume> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    text += " " + pageText;
  }

  console.log("Extracted Text:");


  // Regex extraction
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/;
  const phoneRegex = /(\+91[\s-]?)?[0]?(91)?[6789]\d{9}/;
  const nameRegex = /\b[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2}\b/;

  return {
    name: text.match(nameRegex)?.[0] || "",
    email: text.match(emailRegex)?.[0] || "",
    phone: text.match(phoneRegex)?.[0] || "",
  };
}
