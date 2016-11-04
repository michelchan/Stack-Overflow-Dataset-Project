import numpy as np
import pandas as pd
from sklearn.decomposition import PCA

df = pd.read_json("../data/kmeaned/datawithIntsNoWords.json")
columns = df.columns

from sklearn.preprocessing import StandardScaler
scale = StandardScaler()

X = scale.fit_transform(df)
X = pd.DataFrame(df)
X.columns = columns

n = len(X.columns) - 1
pca = PCA(n_components = n)
X_pca = pca.fit(X).transform(X)

df_pca = pd.DataFrame(X_pca)

# df_pca.to_json('../data/biplot.json')

dict = {}

# maximum variance of first two pcs
xvector = pca.components_[0]
yvector = pca.components_[1]

# first two pcas for axises
xs = pca.transform(X)[:,0]
ys = pca.transform(X)[:,1]

scalex = 1.0/(xs.max() - xs.min())
scaley = 1.0/(ys.max() - ys.min())

# points to plot
array = []
for i in range(2074):
	array.append([xs[i]*scalex, ys[i]*scaley])

dict["xvector"] = xvector.tolist()
dict["yvector"] = yvector.tolist()
dict["data"] = array

import json
with open('../data/anotherBiplot.json', 'w') as f:
	json.dump(dict, f)