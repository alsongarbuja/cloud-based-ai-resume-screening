from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
from vectorize import load_vectorizer
from data_cleaning import generate_clean_data

vectorizer = load_vectorizer()

job_post_text = ["experience in git github"]
resume_texts = generate_clean_data("resume", "Resume", "resume_dataset.csv")

job_vector = vectorizer.transform(job_post_text)
resume_vectors = vectorizer.transform(resume_texts)

print(f"Job Vector Shape: {job_vector.shape}")
print(f"Resume Vectors shape: {resume_vectors.shape}")

similarity_scores = cosine_similarity(job_vector, resume_vectors)

scores_list = similarity_scores.flatten()

results_df = pd.DataFrame({
  'Resume Index': range(len(resume_texts)),
  'Similarity Score': scores_list,
})

ranked_candidates = results_df.sort_values(by='Similarity Score', ascending=False)

print(ranked_candidates.head(1))
