illis = ["nilli","milli","billi","trilli","quadrilli","quintilli","sextilli","septilli","octilli",
        "nonilli","decilli","undecilli","duodecilli","tredecilli","quattuordecilli","quindecilli","sexdecilli",
        "septendecilli","octodecilli","novemdecilli","vigintilli"]

prefixunits = ["","un","duo","tre","quattuor","quin","se","septe","octo","nove"]
prefixtens = ["","deci","viginti","triginta","quadraginta","quinquaginta","sexaginta","septuaginta","octoginta","nonaginta"]
prefixhundreds = ["","centi","ducenti","trecenti","quadringenti","quingenti","sescenti","septingenti","octingenti","nongenti"]
prefixtenscond = ["","N","MS","NS","NS","NS","N","N","MX",""]
prefixhundredscond = ["","NX","N","NS","NS","NS","N","N","MX",""]

def illi(k):
    if k <= 20:
        return illis[k]

    ans = ""
    prefixcond = ""

    if k >= 100:
        ans = prefixhundreds[k // 100] + ans
        prefixcond = prefixhundredscond[k // 100]
        k %= 100

    if k >= 10:
        ans = prefixtens[k // 10] + ans
        prefixcond = prefixtenscond[k // 10]
        k %= 10

    if k == 3: prefix = "tre" + ("s" if "S" in prefixcond else "") + ("s" if "X" in prefixcond else "")
    elif k == 6: prefix = "se" + ("s" if "S" in prefixcond else "") + ("x" if "X" in prefixcond else "")
    elif k == 7: prefix = "septe" + ("m" if "M" in prefixcond else "") + ("n" if "N" in prefixcond else "")
    elif k == 9: prefix = "nove" + ("m" if "M" in prefixcond else "") + ("n" if "N" in prefixcond else "")
    else: prefix = prefixunits[k]

    ans = prefix + ans
    return ans[:-1] + "illi"

def illion(k):
    if k == 0:
        return "thousand"
    ans = ""
    while k:
        ans = illi(k % 1000) + ans
        k //= 1000
    return ans + "on"

def illionsum(n):
    def f(n,b):
        if n < 0: return 0
        return (n//b + 1)*(2*n - n//b * b)//2

    lessthan1000 = [len(illi(n)) for n in range(1000)] + [len(illi(0))]     # milli, billi, ..., 999-illi, nilli

    ans = 8 + 2*n
    for i in range(1,1001):
        ans += lessthan1000[i] * ((n-i) // 1000 + 1)

    pow10 = 1000
    while pow10 <= n:
        for i in range(1,1001):
            ans += lessthan1000[i] * (f(n-i*pow10+1, 1000*pow10) - f(n-(i+1)*pow10+1, 1000*pow10))
        pow10 *= 1000

    return ans

def answer_pow10(m):    # answer(10**m)
    assert m >= 3

    big = 297 + 21113 * (m//3) + 999 * illionsum((m-6)//3)
    k = (m-3)//3
    small = -297 + len(illion(k))

    if m % 3 == 0:
        small += 3
    elif m % 3 == 1:
        big += 3600 + 900 * len(illion(k))
        small += 3
    elif m % 3 == 2:
        big += 8540 + 990 * len(illion(k))
        small += 10

    return f"{big} * 10**{m-3} {'+' if small >= 0 else '-'} {abs(small)}"   # print out  [big * 10**(m-3) + small]  in a nicer format

for i in range(10,101,10):
    print(f"answer(10**10**{i}) = {answer_pow10(10**i)}")
