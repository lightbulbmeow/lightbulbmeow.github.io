def count_nonzero(N): #counts the number of nonzero digits in N
    strN = str(N)
    return len(strN) - strN.count("0")

unsatisfied = [] #List of n which failed to satisfy count_nonzero(n) > 35. Should be empty

L = 2000    #lowest value of N it should check
R = 2000000 #highest value of N it should check
D = 60      #number of last digits it should check

n = L
pow5 = pow(5,n,10**D)

while n < R:
    nonzerocount = count_nonzero(pow5)
    if nonzerocount > 35:
        print(f"5^{n} = {pow5} => {nonzerocount} nonzero digits")
    else:
        unsatisfied.append(n)
    #iterate
    n += 1
    pow5 = (5 * pow5) % 10**D

print(f"{len(unsatisfied)} unsatisfied integers:",unsatisfied)