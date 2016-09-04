import numpy as np

N = 11
r = 10

b = np.random.random_integers(0,r,size=(N,N))
b_symm = np.matrix.round((b + b.T)/2)

print(b_symm)
