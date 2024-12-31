def digit_multiset(s): #Convert string s to a digit multiset
    return {d:s.count(d) for d in "1234567890"}

def is_subset(A,B): #Check if A is a subset of B
    #for A to be a subset of B, every digit count in A must be at most that of B 
    return all(A[d] <= B[d] for d in "1234567890")

def subtract_multiset(A,B): #subtracts multiset A from B: B-A
    return {d: B[d] - A[d] for d in "1234567890"} 

def multiset_to_int(A): #convert a digitmultiset to an integer
    return "".join(d*A[d] for d in "1234567890")

special = {2:  "5^2",
           3:  "5^(1 + 2)",
           4:  "5^(6 - 2)",
           5:  "5^(3 + 1 * 2)",
           6:  "5^6 * 1^52",
           7:  "5^7 * 1^82",
           8:  "5^(6 + 2) + 0 * 39",
           9:  "5^9 + (1 - 1) * 532",
           10: "5^(7 + 5 - 2) + (6 - 6) * 9",
           11: "5^(88 / 8) + (2 - 2) * 41",
           14: "5^(13 + 1) + 0 * 65562",
           17: "5^17 + (2 - 2) * 6939453",
           18: "5^18 + (2 - 2) * 34697656",
           20: "5^20 + (3 - 3) * 956741646",
           23: "5^(22 + 1) + 0 * 199895507812",
           30: "5^(31 - 1) + (2 - 2) * 935746547851562",
           33: "5^(32 + 1) + (1 - 1) * 645182693481445312",
           43: "5^(11 + 32) + 0 * 6868377161629739379882812",
           45: "5^(44 + 1) + 0 * 282709340400743484497070312",
           48: "5^(30 + 18) + 0 * 5527367850092935562133789062",
           58: "5^58 + (4 - 4) * 346969195361418823848962783813476562",
}

missing = [] #List of n this program failed to find. Should be empty

N = 2000 #highest value of N that it should check

for n in range(2,N):
    pow5 = str(5**n)

    #find if digits of n, 5, 0 exist in 5^n
    n50 = str(n) + "50" #digits required in the expression
    pow5_dig = digit_multiset(pow5)
    n50_dig = digit_multiset(n50)
    if is_subset(n50_dig, pow5_dig):
        new_dig = subtract_multiset(n50_dig, pow5_dig)
        new_int = multiset_to_int(new_dig)
        print(f"{pow5} = 5^{n} + 0 * {new_int}")

    elif n in special:
        print(f"{pow5} = {special[n]}")

    else:
        missing.append(n)

print(f"{len(missing)} missing integers:",missing)
        
