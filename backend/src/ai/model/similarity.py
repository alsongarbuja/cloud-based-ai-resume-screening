import io
import sys
import json
import pandas as pd
from vectorize import load_vectorizer
from sklearn.metrics.pairwise import cosine_similarity

sys.stdout = io.TextIOWrapper(sys.stdout.detach(), encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.detach(), encoding='utf-8')

def run_model(inputs: dict):
  vectorizer = load_vectorizer()

  clean_resumes_texts = inputs['resumes_texts']
  job_post_texts = inputs['job_post_texts']

  if isinstance(job_post_texts, str):
    job_post_texts = [job_post_texts]
  if isinstance(clean_resumes_texts, str):
    clean_resumes_texts = [clean_resumes_texts]

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
    # print(input_data)
    result = run_model(input_data)
    print(json.dumps(result))
  except Exception as e:
    # Print errors to stderr
    print(f"Error during execution: {e}", file=sys.stderr)
    sys.exit(1)
