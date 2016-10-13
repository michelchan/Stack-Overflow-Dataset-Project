from sklearn.cluster import KMeans
import numpy as np
import pandas as pd


# Load csv from file
df = pd.read_csv('../data/stackoverflow.csv')

# Set up data
# df = df.fillna('n/a')
# df.replace({'collector':choices, 'gender':choices})
# df.applymap(lambda s: mapping.get(s) if s in mapping else s)
# del df['Unnamed: 0']

from sklearn.cross_validation import train_test_split
occupation = df.pop('occupation')
X = df
X_train, X_test, y_train, y_test = train_test_split( X, occupation, test_size=0.33, random_state=42)
print X_test

# df = df.fillna('-99')
# kmeans = KMeans(n_clusters = 10).transform(df)
# print kmeans.cluster_centers_

# Save to csv again
X_test.to_csv('../data/sampling.csv', index=False)