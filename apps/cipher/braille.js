// ui

const inputcode = document.getElementById('inputcode')
const output = document.getElementById('output')
const malformed = document.getElementById('malformed')

// actual code

numberletters = [32,48,36,38,34,52,54,50,20,22,40,56,44,46,42,60,62,58,28,30,41,57,23,45,47,43]
brailletoletters = {0:' ',15:'#',19:'.',16:',',24:';',18:':',12:'/',25:'?',26:'!',10:'#',11:'"',8:"'",49:'<',14:'>',27:'(',1:'^',9:'_',61:'&'}
brailletodigits = {0:' ',3:'#',22:'0',19:'.',16:',',24:';',18:'-',12:'/',25:'?',26:'+',10:'#',11:'"',8:"'",49:'<',14:'>',27:'(',1:'^',9:'_',61:'&'}

for(let i = 0; i < 26; i ++) brailletoletters[numberletters[i]] = String.fromCharCode(97+i);
for(let i = 0; i < 9; i ++) brailletodigits[numberletters[i]] = String.fromCharCode(49+i);

function getchar(c){
  if(c == '?') return '?';
  if(c == '1' || c == 'o') return '1';
  if(c == '0' || c == '.') return '0';
}

function matches(b,dots){
  for(let i = 0; i < 6; i ++) if(dots[i] != '?' && b[i] != dots[i]) return false;
  return true;
}

function getletter(dots){
  if(dots == '??????') return '.';
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

function decodestring(input){
  console.log(input);
  let dots = [];
  for(const c of input){
    let x = getchar(c);
    if(x) dots.push(x);
  }
  while(dots % 6) dots.push('?');
  ans = ""
  num = false  // whether 'numbers follow' or 'letters follow'
  openparen = false  // whether ( is found
  capital = false  // whether ^ is found
  for(let i = 0; i < dots.length; i += 6){
    if(!num) c = getletter(dots.slice(i,i+6).join(''));
    else c = getdigit(dots.slice(i,i+6).join(''));
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
  inputs = inputcode.value.toLowerCase().split(/\r?\n/);
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
  output.innerText = ans;
  if(ans.includes('[]')) malformed.innerText = "Your input might be malformed";
  else malformed.innerText = "Decoded text:";
}
