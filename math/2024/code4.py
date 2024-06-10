mem = {}

def polymul(A,B):
    n = len(A)
    C = [0]*n
    for i in range(n):
        if A[i] == 0: continue
        for j in range(n-i):
            C[i+j] += A[i]*B[j]
    return C

from math import comb

mem = {}

def g(n): # red root
   if n == 0: return 0
   if n == 1: return 1
   if n in mem: return mem[n]
   poly = [1] + [0]*(n-1)
   for k in range(1,n):
       factor = [0]*n
       for i in range((n-1)//k+1):
           factor[k*i] = comb(g(k)+i-1,g(k)-1)
       poly = polymul(factor,poly)
   poly = polymul(poly,poly)
   mem[n] = poly[n-1]
   return poly[n-1]

def f(n):
    if n == 0: return 0
    if n == 1: return 3
    poly = [1] + [0]*(n-1)
    for k in range(1,(n-1)//2+1):
       factor = [0]*n
       for i in range((n-1)//k+1):
           factor[k*i] = comb(g(k)+i-1,g(k)-1)
       poly = polymul(factor,poly)
    poly = polymul(poly,poly)
    ans = 3*poly[n-1]
    if n % 2 == 0:
        ans += g(n//2)**2 * 3
    return ans

[g(i) for i in range(11)]
[f(i) for i in range(11)]
