let answer = document.getElementById("answer")
let submit = document.getElementById("submit")
let verdict = document.getElementById("verdict")

let akariyep = "../emojis/akariyep.webp"
let akarinope = "../emojis/akarinope.webp"

function clean(s){
    return s.toUpperCase().replace(/[^A-Z0-9]+/g,'');
}

submit.onclick = function(){
    let useranswer = answer.value;
    let correctanswer = atob(answer.dataset.base64Answer);
    if(clean(useranswer) == clean(correctanswer)){
        answer.value = correctanswer
        verdict.innerHTML = "<b><span style='color:lime'>CORRECT!!!</span> <img src='" + akariyep + "' height=24></b>"
    }else{
        verdict.innerHTML = "<b><span style='color:red'>WRONG!!!</span> <img src='" + akarinope + "' height=24></b>"
    }
}

answer.addEventListener("keyup", function(event){
    if(event.keyCode == 13) submit.click(); // Enter key
})
