// ui

const inputcode = document.getElementById('inputcode')
const output = document.getElementById('output')
const malformed = document.getElementById('malformed')

// actual code

numberletters = [[1,2],[2,4],[2,7],[2,8],[2,9],[2,6],[2,3],[1,4],[1,7],[6,8],[1,8],[1,9],[1,6],[1,3],[4,7],[4,8],[4,9],[4,6],[3,4],[7,8],[7,9],[3,8],[6,9],[3,9],[6,7],[3,6]]
flagtoletters = {22:' ',89:'#',98:'#'}
flagtodigits = {22:' ',68:'#',86:'#',18:'0',81:'0'}

for(let i = 0; i < 26; i ++){
  [x,y] = numberletters[i];
  flagtoletters[10*x+y] = String.fromCharCode(97+i);
  flagtoletters[10*y+x] = String.fromCharCode(97+i);
}

for(let i = 0; i < 9; i ++){
  [x,y] = numberletters[i];
  flagtodigits[10*x+y] = String.fromCharCode(49+i);
  flagtodigits[10*y+x] = String.fromCharCode(49+i);
}

function getchar(c){
  // 5 is the wildcard
  if(c == '5' || c == 's' || c == '?') return 5;
  if('1'<=c && c<='9') return parseInt(c);
  else if('zxcadqwe'.includes(c)) return ' zxca dqwe'.indexOf(c);
}

function getletter(x,y){
  if(x!=5 && y==5) return getletter(y,x);
  if(x==5 && y==5) return '.';
  possible = []
  if(x==5){
    for(let i = 1; i <= 9; i ++){
      let c = flagtoletters[10*i+y];
      if(c) possible.push(c);
    }
  }
  else{
    let c = flagtoletters[10*x+y];
    if(c) possible.push(c);
  }
  possible.sort()
  if(possible.length == 1) return possible[0];
  else return '['+possible.join('')+']';
}

function getdigit(x,y){
  if(x!=5 && y==5) return getletter(y,x);
  if(x==5 && y==5) return '.';
  possible = []
  if(x==5){
    for(let i = 1; i <= 9; i ++){
      let c = flagtodigits[10*i+y];
      if(c) possible.push(c);
    }
  }
  else{
    let c = flagtodigits[10*x+y];
    if(c) possible.push(c);
  }
  possible.sort()
  if(possible.length == 1) return possible[0];
  else return '['+possible.join('')+']';
}

function decodestring(input){
  let flags = []
  for(const c of input){
    let x = getchar(c);
    if(x) flags.push(x);
  }
  if(flags.length % 2) flags.push(5);
  ans = ""
  num = false  // whether 'numbers follow' or 'letters follow'
  for(let i = 0; i < flags.length; i += 2){
    if(!num) c = getletter(flags[i],flags[i+1]);
    else c = getdigit(flags[i],flags[i+1]);
    if(c == "#") num = !num;
    else ans += c;
  }
  return ans;
}

function decode(){
  ans = inputcode.value.toLowerCase().split(/\r?\n/).map(decodestring).join('\n');
  output.innerText = ans;
  if(ans.includes('[]')) malformed.innerText = "Your input might be malformed";
  else malformed.innerText = "Decoded text:";
}
