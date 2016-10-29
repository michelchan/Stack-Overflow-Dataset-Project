from sklearn.decomposition import PCA as sklearnPCA
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction import DictVectorizer

# Load csv from file
df = pd.read_json('../data/correlation/forCorrelationMatrix.json')

corr = df.corr()
print corr

# Save to csv again
corr.to_csv('../data/correlation.csv')