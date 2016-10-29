from sklearn.decomposition import PCA as sklearnPCA
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

# Load csv from file
df = pd.read_json('../data/kmeaned/datawithIntsNoWords.json')
X = df.ix[:,0:10].values
y = df.ix[:,10].values

X_std = StandardScaler().fit_transform(X)

cov_mat = np.cov(X_std.T)

eig_vals, eig_vecs = np.linalg.eig(cov_mat)


f = open('../data/eigenvalues.txt', 'w+')
f.write('\nEigenvalues \n%s' %eig_vals)
f.close()