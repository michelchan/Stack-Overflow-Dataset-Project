from sklearn.decomposition import PCA as sklearnPCA
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.manifold import MDS


# Load csv from file
df = pd.read_json('../data/kmeaned/datawithIntsNoWords.json')

mds = MDS(n_components = 2)
corr = df.corr()
d = mds.fit_transform(df).tolist()
import json
with open('../data/mdsData.json', 'w') as f:
	json.dump(d, f)