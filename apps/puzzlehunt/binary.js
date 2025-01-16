// ui

const inputcode = document.getElementById('inputcode')
const output = document.getElementById('output')
const malformed = document.getElementById('malformed')

const fivebit = document.getElementById('fivebit')
const eightbit = document.getElementById('eightbit')
const fivebitoptions = document.getElementById('fivebitoptions')
const eightbitoptions = document.getElementById('eightbitoptions')

const allowspaces2 = document.getElementById('allowspaces2')
const nutrimatic2 = document.getElementById('nutrimatic2')

const allowuppercase = document.getElementById('allowuppercase')
const allowlowercase = document.getElementById('allowlowercase')
const allowdigits = document.getElementById('allowdigits')
const allowspaces = document.getElementById('allowspaces')
const allowsymbols = document.getElementById('allowsymbols')
const nutrimatic = document.getElementById('nutrimatic')

// actual code

let validascii
let bitmode

function inittable(){
  // initialize the conversion table

  if(fivebit.checked){
    fivebitoptions.style.display = "";
    eightbitoptions.style.display = "none";
    bitmode = 5
    validascii = []
    for(let i = 1; i <= 26; i ++) validascii.push(i);
    if(allowspaces2.checked) validascii.push(0);

  }else if(eightbit.checked){
    fivebitoptions.style.display = "none";
    eightbitoptions.style.display = "";
    bitmode = 8
    validascii = []

    if(allowuppercase.checked) for(let i = 1; i <= 26; i ++) validascii.push(64+i);
    if(allowlowercase.checked) for(let i = 1; i <= 26; i ++) validascii.push(96+i);
    if(allowdigits.checked) for(let i = 1; i <= 10; i ++) validascii.push(48+i);
    if(allowspaces.checked) validascii.push(32);
    if(allowsymbols.checked){
      symbols = "\n!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
      for(let i = 0; i < symbols.length; i ++) validascii.push(symbols[i].charCodeAt(0));
    }
  }

  decode();
}

function getcandidates(binary){
  // see which characters matches like 01??01?1
  zero = parseInt(binary.replace(/\?/g, "0"), 2)
  one = parseInt(binary.replace(/\?/g, "1"), 2)
  candidates = []
  for(let c of validascii){
    if((c & zero) == zero && (c | one) == one) candidates.push(c)
  }
  return candidates
}

function decodestring(input){
  let binary = ""
  let ans = ""

  for(let c of input){
    if("01?".includes(c)) binary += c;
  }

  while(binary.length % bitmode != 0) binary += "0";
  for(let i = 0; i < binary.length; i += bitmode){
    let candidates = ""
    for(let c of getcandidates(binary.slice(i,i+bitmode))){
      if(fivebit.checked){
        if(c != 0) candidates += String.fromCharCode(c + 64);
        else candidates += " ";
      }else if(eightbit.checked){
        candidates += String.fromCharCode(c);
      }
    }
    if(candidates.length == 1) ans += candidates;
    else if(candidates.length == validascii.length) ans += "?";
    else ans += "[" + candidates + "]";
  }

  return ans;
}

function decode(){
  ans = decodestring(inputcode.value);

  if((fivebit.checked && nutrimatic2.checked) || (eightbit.checked && nutrimatic.checked)){
    ans = ans.toLowerCase().replace(/\?/g,'A')
  }

  output.innerText = ans;
  if(ans.includes('[]')) malformed.innerText = "Your input might be malformed or contains unsupported symbols";
  else malformed.innerText = "Decoded text:";
}

inputcode.addEventListener("input", () => { if(inputcode.value.length < 1000) decode(); });
fivebit.addEventListener("input", inittable);
eightbit.addEventListener("input", inittable);
allowuppercase.addEventListener("input", inittable);
allowlowercase.addEventListener("input", inittable);
allowdigits.addEventListener("input", inittable);
allowspaces.addEventListener("input", inittable);
allowsymbols.addEventListener("input", inittable);
nutrimatic.addEventListener("input", inittable);
allowspaces2.addEventListener("input", inittable);
nutrimatic2.addEventListener("input", inittable);
inittable();
