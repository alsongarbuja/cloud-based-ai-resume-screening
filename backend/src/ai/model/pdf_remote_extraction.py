import re
import sys
import string
import requests
from pypdf import PdfReader
from io import BytesIO
import io
import nltk

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

nltk.download('stopwords', quiet=True)

from nltk.corpus import stopwords

def clean_resume_text(text):
    """
    Performs specialized cleaning for unstructured resume text.
    Removes contact info, extensive punctuation, and standard noise.
    """
    if not isinstance(text, str):
        return ""

    text = text.lower()

    # 1. REMOVE CONTACT INFO (Crucial for privacy and noise reduction)
    text = re.sub(r'[\d]{2,}[\s\-\.\/]?[\d]{2,}[\s\-\.\/]?[\d]{2,}[\s\-\.\/]?[\d]{2,}', '', text) # Phone numbers
    text = re.sub(r'\S*@\S*\s?', '', text)  # Emails
    text = re.sub(r'\b\d+\b', '', text)     # General numbers (e.g., years, figures)

    # 2. REMOVE URLs and HTML
    text = re.sub(r'http\S+|www\S+|https\S+|<.*?>', '', text, flags=re.MULTILINE)

    # 3. NORMALIZE WHITESPACE
    # Replaces newlines, tabs, and multiple spaces with a single space
    text = ' '.join(text.split())

    # 4. REMOVE ALL PUNCTUATION (Including common resume symbols like bullets)
    # Adds common resume symbols to the standard punctuation list
    all_punctuation = string.punctuation + '—•'
    text = text.translate(str.maketrans('', '', all_punctuation))

    # 5. REMOVE STOP WORDS
    stop_words = set(stopwords.words('english'))
    tokens = text.split()
    tokens = [word for word in tokens if word not in stop_words]

    return " ".join(tokens)

def extract_text_from_remote_pdf(pdf_url):
    """
    Downloads PDF content from a remote URL and extracts text using in-memory processing.
    """
    try:
        # 1. Download the PDF content (as bytes)
        response = requests.get(pdf_url, timeout=10) # Set a timeout
        response.raise_for_status() # Raise exception for bad status codes (4xx or 5xx)

        # 2. Create an in-memory file-like object (BytesIO) from the downloaded content
        pdf_bytes = BytesIO(response.content)

        # 3. Pass the in-memory object to PdfReader
        # PdfReader can read from a file path OR a file-like object (like BytesIO)
        reader = PdfReader(pdf_bytes)
        full_text = ""

        for page in reader.pages:
            full_text += page.extract_text() + "\n"

        return clean_resume_text(full_text)

    except requests.exceptions.RequestException as e:
        print(f"Error downloading or connecting to URL {pdf_url}: {e}")
        return ""
    except Exception as e:
        print(f"Error processing pdf {pdf_url}: {e}")
        return ""

if __name__ == "__main__":
  # The input argument passed from NestJS (sys.argv[1])
  input_arg = sys.argv[1]

  try:
    extracted_text = extract_text_from_remote_pdf(input_arg)
    print(extracted_text)
  except Exception as e:
    # Print errors to stderr
    print(f"Error during execution: {e}", file=sys.stderr)
    sys.exit(1)
