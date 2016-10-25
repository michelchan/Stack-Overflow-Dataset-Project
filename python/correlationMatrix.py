from sklearn.cluster import KMeans
import numpy as np
import pandas as pd

# Load csv from file
df = pd.read_json('../data/datawithIntsNoWords.json')

# get eigenvector and eigenvalue
X = df.ix[:,0:4].values
y = df.ix[:,4].values

cor_mat2 = np.corrcoef(X.T)
eVals, eVecs = np.linalg.eig(cor_mat2)

# sorting eigenpairs
for ev in eVecs:
	np.testing.assert_array_almost_equal(1.0, np.linalg.norm(ev))

ePairs = [(np.abs(eVals[i]), eVecs[:,i]) for i in range(len(eVals))]
ePairs.sort(key=lambda x: x[0], reverse=True)
for i in ePairs:
	print(i[0])

total = sum(eVals)
var_exp = [(i / total)*100 for i in sorted(eVals, reverse=True)]
cum_var_exp = np.cumsum(var_exp)

# projection matrix
