// ui

const inputcode = document.getElementById('inputcode');
const tabsize = document.getElementById('tabsize');

function format(){
  let result = '';
  let lvl = 0;
  let indentchar = " ".repeat(tabsize.value)
  for(const c of inputcode.value){
    if(c == '['){
      lvl ++;
      result += '[\n' + indentchar.repeat(lvl);
    }else if(c == ']'){
      lvl --;
      result += '\n' + indentchar.repeat(lvl) + ']';
    }else{
      result += c;
    }
  }
  inputcode.value = result;
  resize();
}

function resize(){
  inputcode.style.height = 'auto';
  inputcode.style.height = inputcode.scrollHeight + 'px';
}
