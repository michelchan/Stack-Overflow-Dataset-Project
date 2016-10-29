from sklearn.decomposition import PCA as sklearnPCA
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction import DictVectorizer

# Load csv from file
df = pd.read_json('../data/kmeaned/datawithIntsNoWords.json')
X = df.ix[:,0:2].values
y = df.ix[:,2].values

X_std = StandardScaler().fit_transform(X)

sklearn_pca = sklearnPCA(n_components=2)
Y_sklearn = sklearn_pca.fit_transform(X_std)

array = sklearn_pca.fit_transform(X_std).tolist()

f = open('../data/file', 'w+')
for i in array:
	f.write(str(i) + "\n")
f.close()
