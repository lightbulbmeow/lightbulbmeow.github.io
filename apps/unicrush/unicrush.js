// ui

const inputcode = document.getElementById('inputcode')
const outputcode = document.getElementById('outputcode')
const charcount = document.getElementById('charcount')

String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

function unicrush(){
  ans = inputcode.value
  for(const pair of subs) ans = ans.replaceAll(pair[0], pair[1])
  outputcode.value = ans
  charcount.innerText = inputcode.value.length - outputcode.value.length
}

function expand(){
  ans = outputcode.value
  for(const pair of subs) ans = ans.replaceAll(pair[1], pair[0])
  ans = ans.replace(/''/g, '"')
  inputcode.value = ans
  charcount.innerText = inputcode.value.length - outputcode.value.length
}

inputcode.addEventListener("input", () => { if(inputcode.value.length < 1000) unicrush(); });
outputcode.addEventListener("input", () => { if(inputcode.value.length < 1000) expand(); });
unicrush();
