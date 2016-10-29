from sklearn.cluster import KMeans
import numpy as np
import pandas as pd
import random

# Load csv from file
df = pd.read_csv('../data/kmeaned/usethis.csv')
df = df.fillna(df.mean())
df.to_csv('../data/kmeaned/kmeanedNoWords.csv', index=False)