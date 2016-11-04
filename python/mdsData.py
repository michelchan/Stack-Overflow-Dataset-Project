import numpy as np
import pandas as pd
from sklearn.manifold import MDS
from sklearn.metrics import euclidean_distances
from sklearn.datasets import make_classification

data, labels = make_classification()
mds = MDS(n_components = 2)
df = pd.read_json("../data/kmeaned/datawithIntsNoWords.json")

d = mds.fit_transform(df).tolist()
import json
with open('../data/mdsData.json', 'w') as f:
	json.dump(d, f)