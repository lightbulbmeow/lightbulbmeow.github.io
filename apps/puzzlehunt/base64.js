// ui

const inputcode = document.getElementById('inputcode')
const output = document.getElementById('output')
const malformed = document.getElementById('malformed')

const allowuppercase = document.getElementById('allowuppercase')
const allowlowercase = document.getElementById('allowlowercase')
const allowdigits = document.getElementById('allowdigits')
const allowspaces = document.getElementById('allowspaces')
const allowsymbols = document.getElementById('allowsymbols')
const nutrimatic = document.getElementById('nutrimatic')

// actual code

let base64alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
let validascii

function inittable(){
  // initialize the conversion table
  validascii = []

  if(allowuppercase.checked) for(let i = 1; i <= 26; i ++) validascii.push(64+i);
  if(allowlowercase.checked) for(let i = 1; i <= 26; i ++) validascii.push(96+i);
  if(allowdigits.checked) for(let i = 1; i <= 10; i ++) validascii.push(48+i);
  if(allowspaces.checked) validascii.push(32);
  if(allowsymbols.checked){
    symbols = "\n!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
    for(let i = 0; i < symbols.length; i ++) validascii.push(symbols[i].charCodeAt(0));
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
  while(input.length % 4) input += "=";

  input = input.replace(/=/g, "A")
  let binary = ""
  let ans = ""

  for(let i = 0; i < input.length; i ++){
    if(input[i] == "?"){
      binary += "??????";
    }else{
      ind = base64alphabet.indexOf(input[i]);
      if(ind != -1) binary += ind.toString(2).padStart(6,"0");
    }
  }

  while(binary.slice(-8) == "00000000") binary = binary.slice(0,-8);
  for(let i = 0; i < binary.length; i += 8){
    let candidates = ""
    for(let c of getcandidates(binary.slice(i,i+8))) candidates += String.fromCharCode(c);
    if(candidates.length == 1) ans += candidates;
    else if(candidates.length == validascii.length) ans += "?";
    else ans += "[" + candidates + "]";
  }

  return ans;
}

function decode(){
  ans = decodestring(inputcode.value);

  if(nutrimatic.checked){
    ans = ans.toLowerCase().replace(/\?/g,'A')
  }

  output.innerText = ans;
  if(ans.includes('[]')) malformed.innerText = "Your input might be malformed or contains unsupported symbols";
  else malformed.innerText = "Decoded text:";
}

inputcode.addEventListener("input", () => { if(inputcode.value.length < 1000) decode(); });
allowuppercase.addEventListener("input", inittable);
allowlowercase.addEventListener("input", inittable);
allowdigits.addEventListener("input", inittable);
allowspaces.addEventListener("input", inittable);
allowsymbols.addEventListener("input", inittable);
nutrimatic.addEventListener("input", inittable);
inittable();
