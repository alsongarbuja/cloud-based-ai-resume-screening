import sys
import json
import pandas as pd
from vectorize import load_vectorizer
from sklearn.metrics.pairwise import cosine_similarity

def run_model(job_post_texts: list[str], resumes_texts: list[str]):
  vectorizer = load_vectorizer()

  clean_resumes_texts = resumes_texts

  job_vector = vectorizer.transform(job_post_texts)
  resume_vectors = vectorizer.transform(clean_resumes_texts)

  print(f"Job Vector Shape: {job_vector.shape}")
  print(f"Resume Vectors shape: {resume_vectors.shape}")

  similarity_scores = cosine_similarity(job_vector, resume_vectors)

  scores_list = similarity_scores.flatten()

  results_df = pd.DataFrame({
    'Resume Index': range(len(clean_resumes_texts)),
    'Similarity Score': scores_list,
  })

  ranked_candidates = results_df.sort_values(by='Similarity Score', ascending=False)

  print(ranked_candidates.head(1))

if __name__ == "__main__":
  # The input argument passed from NestJS (sys.argv[1])
  input_arg = sys.argv[1]

  try:
    input_data = json.loads(input_arg)
    result = run_model(input_data)

    # 🔑 CRITICAL: Print the result JSON to stdout for NestJS to capture
    print(json.dumps(result))
  except Exception as e:
    # Print errors to stderr
    print(f"Error during execution: {e}", file=sys.stderr)
    sys.exit(1)
