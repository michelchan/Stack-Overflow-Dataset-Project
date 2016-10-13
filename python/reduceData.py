from sklearn.cluster import KMeans
import numpy as np
import pandas as pd
import random

# Load csv from file
df = pd.read_csv('../data/reduceddata.csv')

df = df.fillna('-99')
kmeans = KMeans(n_clusters = 10)
kmeans.fit(df)

# Separate clusters by the appropriate bin
clusters = {i: np.where(kmeans.labels_ == i)[0] for i in range(kmeans.n_clusters)}

# Choose 500 from each cluster
array = []
for key in clusters:
	for i in range(500):
		a = random.choice(clusters[key])
		array.append(a)

sof = pd.read_csv('../data/stackoverflow.csv')
sof_Keep = sof[sof['id'].isin(array)]

# Save to csv again
sof_Keep.to_csv('../data/kmeaned.csv', index=False)