mem = {}

def polymul(A,B):
    n = len(A)
    C = [0]*n
    for i in range(n):
        if A[i] == 0: continue
        for j in range(n-i):
            C[i+j] += A[i]*B[j]
    return C

def g(n):
    if n == 0: return 0
    if n == 1: return 1
    if n in mem: return mem[n]
    p = [0]*n
    p2 = [0]*n
    for k in range(n):
        p[k] += g(k)
        if 2*k < n: p2[2*k] += g(k)
    pp = polymul(p,p)
    ans = (pp[n-1]+p2[n-1])//2+p[n-1]
    mem[n] = ans
    return ans

def f(n):
    if n == 0: return 0
    if n == 1: return 1
    p = [0]*n
    p2 = [0]*n
    p3 = [0]*n
    for k in range((n-1)//2+1):
        p[k] += g(k)
        if 2*k < n: p2[2*k] += g(k)
        if 3*k < n: p3[3*k] += g(k)
    pp = polymul(p,p)
    ppp = polymul(pp,p)
    pp2 = polymul(p,p2)
    ans = (ppp[n-1]+pp2[n-1]*3+p3[n-1]*2)//6+(pp[n-1]+p2[n-1])//2+p[n-1]
    if n % 2 == 0:
        ans += g(n//2)*(g(n//2)+1)//2
    return ans

[g(i) for i in range(11)]
[f(i) for i in range(11)]
