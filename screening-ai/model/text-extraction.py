import os
from pypdf import PdfReader
from docx import Document

def extract_text_from_pdf(pdf_path):
  """Extracts text from a single PDF file."""
  try:
    reader = PdfReader(pdf_path)
    full_text = ""

    for page in reader.pages:
      full_text += page.extract_text() + "\n"

    return full_text
  except Exception as e:
    print(f"Error processing pdf {pdf_path}: {e}")
    return ""

def extract_text_from_docx(docx_path):
  """Extracts text from a single DOCX file."""
  try:
    # Create a Document object from the DOCX file
    document = Document(docx_path)
    full_text = ""

    # DOCX files are structured into paragraphs, so we loop through them
    for paragraph in document.paragraphs:
        full_text += paragraph.text + "\n"

    return full_text
  except Exception as e:
    print(f"Error processing DOCX {docx_path}: {e}")
    return ""

def process_resumes(directory_path):
  """Loops through all files in a directory and extracts text."""
  # This will store all the resume texts
  all_resume_texts = []

  # os.listdir gets a list of all files/folders in the path
  for filename in os.listdir(directory_path):
    # Create the full file path
    file_path = os.path.join(directory_path, filename)

    # Check the file type (extension)
    if filename.lower().endswith(".pdf"):
      text = extract_text_from_pdf(file_path)
      all_resume_texts.append(text)
      print(f"Extracted text from PDF: {filename}")

    elif filename.lower().endswith(".docx"):
      text = extract_text_from_docx(file_path)
      all_resume_texts.append(text)
      print(f"Extracted text from DOCX: {filename}")

  return all_resume_texts
