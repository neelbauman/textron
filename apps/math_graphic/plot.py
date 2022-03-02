import numpy as np
import matplotlib.pyplot as plt

import json

x = np.random.rand(100)
y = np.random.rand(100)

randplot = plt.scatter(x, y)
print(json.dumps(randplot))
