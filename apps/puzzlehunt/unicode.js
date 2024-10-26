// ui

const inputcode = document.getElementById('inputcode')
const output = document.getElementById('output')

function escapeHtml(unsafe)
{
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function extract(){
  let tablecode = "<tr>";
  tablecode += "<th></th>";
  tablecode += "<th>Hex</th>";
  tablecode += "<th>Dec</th>";
  tablecode += "<th>Name</th>";
  tablecode += "<th>Cat</th>";
  tablecode += "</tr>";

  for(const c of inputcode.value){
    let dec = c.codePointAt(0);
    let charinfo = symbols.get(dec);
    console.log(charinfo);
    tablecode += "<tr>";
    tablecode += "<td style='text-align: center'><b>" + escapeHtml(c) + "</b></td>"
    tablecode += "<td style='text-align: right'>" + dec.toString(16).toUpperCase() + "</td>";
    tablecode += "<td style='text-align: right'>" + dec + "</td>";
    if(charinfo != undefined){
      tablecode += "<td>" + escapeHtml(charinfo[1] == "<control>" ? charinfo[10] : charinfo[1]) + "</td>";
      tablecode += "<td>" + escapeHtml(charinfo[2]) + "</td>";
    }else{
      tablecode += "<td>-</td>";
      tablecode += "<td>-</td>";
    }
    tablecode += "</tr>";
  }

  output.innerHTML = tablecode;
}

inputcode.addEventListener("input", () => { if(inputcode.value.length < 1000) extract(); });
extract();
