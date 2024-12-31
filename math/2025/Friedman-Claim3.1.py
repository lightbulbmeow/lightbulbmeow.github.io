from itertools import combinations_with_replacement, product

def digit_multiset(S): #convert digit tuple into a multiset
    return {d:S.count(d) for d in range(1,10)}

def digit_tuple(A): #convert digit multiset to a tuple
    S = ()
    for d in range(1,10):
        S += (d,)*A[d]
    return S

def multiset_to_int(A): #convert a digitmultiset to an integer
    return "".join(str(d)*A[d] for d in range(1,10))

def is_subset(A,B): #Check if list of digits A is a subset of multiset B
    return all(A.count(d) <= B[d] for d in A)

def subtract_multiset(A,B): #subtracts list of digits A from B: B-A
    _B = dict(B) #copy of B to not affect B itself
    for d in A:
        _B[d] -= 1
    return _B

def find_plus_minus(d,S): #finds an expression for d using S and only + or -. if found, return the expression. otherwise, False
    #example: 3 = 4 + 5 - 6
    for signs in product([0,1,-1,10,-10],repeat = len(S)):
        signsum = sum(sgn*dig for sgn,dig in zip(signs,S))
        if signsum == d:
            #take plus digits
            plus = [dig for sgn,dig in zip(signs,S) if sgn == 1]
            plus += [dig*10 for sgn,dig in zip(signs,S) if sgn == 10]
            #take minus digits
            minus = [dig for sgn,dig in zip(signs,S) if sgn == -1]
            minus += [dig*10 for sgn,dig in zip(signs,S) if sgn == -10]
            if len(minus) == 0:
                #if no terms are minus
                plusexp = " + ".join(f"{dig}" for dig in plus)
                return plusexp
            else:
                #if some terms are minus
                plusexp = " + ".join(f"{dig}" for dig in plus)
                minusexp = " - ".join(f"{dig}" for dig in minus)
                return f"{plusexp} - {minusexp}"
    return False

def find_expression(d,S): #finds an expression for d using S. if found, return the expression. otherwise, False
    digits = digit_multiset(S)

    if is_subset([d],digits):
        #if one of the digits is d, then trivial
        return f"{d}"

    for a in range(1,10):
        for b in range(1,10):
            #if digits a and b are present
            if is_subset([a,b],digits):
                if a+b == d:
                    #d = a + b
                    return f"{a} + {b}"
                if a-b == d:
                    #d = a - b
                    return f"{a} - {b}"
                if a*b == d:
                    #d = a * b
                    return f"{a} * {b}"
                if a == d*b:
                    #d = a / b
                    return f"{a} / {b}"

    for a in range(1,10):
        if is_subset([a]*(d+1),digits):
            #if there are (d+1) digit a's, then d = (a + ... + a) / a
            numerator = " + ".join([str(a)]*d)
            return f"({numerator}) / {a}"

    #find solutions where only + or - are involved
    plus_minus = find_plus_minus(d,S)
    if plus_minus:
        return plus_minus

    for a in range(1,10):
        if is_subset([a,a],digits):
            #two a's can be used to form a/a = 1
            new_digits = subtract_multiset([a,a],digits)
            new_S = digit_tuple(new_digits)

            #d = (other digits) + a/a
            plus_minus = find_plus_minus(d-1,new_S)
            if plus_minus:
                return f"{plus_minus} + {a} / {a}"

            #d = (other digits) - a/a
            plus_minus = find_plus_minus(d+1,new_S)
            if plus_minus:
                return f"{plus_minus} - {a} / {a}"

    for a in range(1,10):
        if is_subset([a,a,a],digits):
            #three a's can be used to form (a+a)/a = 2
            new_digits = subtract_multiset([a,a,a],digits)
            new_S = digit_tuple(new_digits)

            #d = (other digits) + (a+a)/a
            plus_minus = find_plus_minus(d-2,new_S)
            if plus_minus:
                return f"{plus_minus} + ({a} + {a}) / {a}"

            #d = (other digits) - (a+a)/a
            plus_minus = find_plus_minus(d+2,new_S)
            if plus_minus:
                return f"{plus_minus} - ({a} + {a}) / {a}"

    #special cases for digits that weren't handled in previous ones
    if d == 4:
        if is_subset([8,8,8,8],digits):
            return "8 * 8 / (8 + 8)"
        if is_subset([8,8,9,9],digits):
            return "(80 - 8) / (9 + 9)"
        if is_subset([8,9,9,9],digits):
            return "8 * 9 / (9 + 9)"
        if is_subset([9,9,9,9],digits):
            return "9 - 90 / (9 + 9)"
    if d == 5:
        if is_subset([1,1,1],digits):
            return "10 / (1 + 1)"
        if is_subset([8,8,8],digits):
            return "80 / (8 + 8)"
        if is_subset([9,9,9],digits):
            return "90 / (9 + 9)"
    if d == 6:
        if is_subset([9,9,9,9,9],digits):
            return "9 - (9 + 9 + 9) / 9"
    if d == 9:
        if is_subset([2,2,2],digits):
            return "(20 - 2) / 2"
        if is_subset([6,6,6],digits):
            return "(60 - 6) / 6"

    return False

missing = [] #List of (S,d) this program failed to consider. should be empty

for d in range(1,10):
    for S in combinations_with_replacement(range(1,10), 5):
        expression = find_expression(d,S)
        if expression:
            print(f"{S} {d} = {expression}")
        else:
            missing.append((S,d))

print(f"{len(missing)} missing: {missing}")
