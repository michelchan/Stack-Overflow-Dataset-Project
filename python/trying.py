from sklearn.decomposition import PCA
import numpy as np
import pandas as pd


df = pd.read_json('../data/datawithIntsNoWords.json')
X = df.ix[:,0:4].values
y = df.ix[:,4].values
pca = PCA(n_components=2)
X_r = pca.fit(X).transform(X)

print X_r