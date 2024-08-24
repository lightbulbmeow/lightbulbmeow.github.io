// ui

const inputcode = document.getElementById('inputcode')
const output = document.getElementById('output')
const malformed = document.getElementById('malformed')

const allowdigits = document.getElementById('allowdigits')
const allowspaces = document.getElementById('allowspaces')
const allowsymbols = document.getElementById('allowsymbols')
const nutrimatic = document.getElementById('nutrimatic')

// actual code

let brailletoletters
let brailletodigits

function inittable(){
  numberletters = [32,48,36,38,34,52,54,50,20,22,40,56,44,46,42,60,62,58,28,30,41,57,23,45,47,43]

  brailletoletters = {}
  brailletodigits = {}
  for(let i = 0; i < 26; i ++) brailletoletters[numberletters[i]] = String.fromCharCode(65+i);

  if(allowdigits.checked){
    brailletoletters[15] = '#'
    brailletodigits[3] = '#'
    brailletodigits[22] = '0'
    for(let i = 0; i < 9; i ++) brailletodigits[numberletters[i]] = String.fromCharCode(49+i);
  }

  if(allowspaces.checked){
    brailletoletters[0] = ' '
    brailletodigits[0] = ' '
  }

  if(allowsymbols.checked){
    Object.assign(brailletoletters, {19:'.',16:',',24:';',18:':',12:'/',25:'?',26:'!',10:'#',11:'"',8:"'",49:'<',14:'>',27:'(',1:'^',9:'_',61:'&'})
    Object.assign(brailletodigits, {19:'.',16:',',24:';',18:'-',12:'/',25:'?',26:'+',10:'#',11:'"',8:"'",49:'<',14:'>',27:'(',1:'^',9:'_',61:'&'})
  }

  decode();
}

function getchar(c){ // 'oo..o.' -> '110010'
  if(c == '?') return '?';
  if(c == '1' || c == 'o') return '1';
  if(c == '0' || c == '.') return '0';
}

function clean(l){
  cleanl = "";
  for(const c of l){
    let x = getchar(c);
    if(x) cleanl += x;
  }
  return cleanl
}

function matches(b,dots){
  for(let i = 0; i < 6; i ++) if(dots[i] != '?' && b[i] != dots[i]) return false;
  return true;
}

function getletter(dots){
  if(dots == '??????') return '?';
  let possible = [];
  for(let b = 0; b < 64; b ++){
    if(matches(b.toString(2).padStart(6,'0'),dots)){
      let c = brailletoletters[b];
      if(c) possible.push(c);
    }
  }
  possible.sort()
  if(possible.length == 1) return possible[0];
  else return '['+possible.join('')+']';
}

function getdigit(dots){
  if(dots == '??????') return '?';
  let possible = [];
  for(let b = 0; b < 64; b ++){
    if(matches(b.toString(2).padStart(6,'0'),dots)){
      let c = brailletodigits[b];
      if(c) possible.push(c);
    }
  }
  possible.sort()
  if(possible.length == 1) return possible[0];
  else return '['+possible.join('')+']';
}

function decodestring(input){
  while(input.length % 6) input += '?';
  ans = ""
  num = false  // whether 'numbers follow' or 'letters follow'
  openparen = false  // whether ( is found
  capital = false  // whether ^ is found
  for(let i = 0; i < input.length; i += 6){
    if(!num) c = getletter(input.slice(i,i+6));
    else c = getdigit(input.slice(i,i+6));
    if(c == "#") num = !num;
    else if(c == "^") capital = true;
    else if(c == "("){
      ans += openparen ? ")" : "(";
      openparen = !openparen;
    }else{
      ans += capital ? c.toUpperCase() : c;
      capital = false;
    }
  }
  if(capital) ans += '^';
  return ans;
}

function decode(){
  inputs_dirty = inputcode.value.toLowerCase().split(/\r?\n/);
  inputs = []
  for(const l of inputs_dirty) inputs.push(clean(l));
  if(inputs.length % 3 == 0){ // then its the 3x2 grid layout
    newinputs = [];
    for(let i = 0; i < inputs.length/3; i ++){
      maxlen = Math.max(inputs[3*i].length,inputs[3*i+1].length,inputs[3*i+2].length);
      while(inputs[3*i].length < maxlen) inputs[3*i] += '?';
      while(inputs[3*i+1].length < maxlen) inputs[3*i+1] += '?';
      while(inputs[3*i+2].length < maxlen) inputs[3*i+2] += '?';
      newinputs.push('');
      for(let j = 0; j < maxlen; j ++){
        newinputs[i] += inputs[3*i][j] + inputs[3*i+1][j] + inputs[3*i+2][j];
      }
    }
    inputs = newinputs;
  }
  ans = inputs.map(decodestring).join('\n');

  if(nutrimatic.checked){
    ans = ans.toLowerCase().replace(/\?/g,'A')
  }

  output.innerText = ans;
  if(ans.includes('[]')) malformed.innerText = "Your input might be malformed";
  else malformed.innerText = "Decoded text:";
}

inputcode.addEventListener("input", () => { if(inputcode.value.length < 1000) decode(); });
allowdigits.addEventListener("input", inittable);
allowspaces.addEventListener("input", inittable);
allowsymbols.addEventListener("input", inittable);
nutrimatic.addEventListener("input", inittable);
inittable();
