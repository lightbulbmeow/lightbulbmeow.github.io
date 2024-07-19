//data is loaded in data.js
const picture = document.getElementById("picture")
let index
let seen = []; for(let i = 0; i <= data.length/2; i ++) seen.push(-1); // to make it seem more random

function setrandom(){
    do index = Math.floor(Math.random()*data.length);
    while(seen.includes(index));
    setimage(index);
}

function setprev(){
    if(index == 0) setimage(data.length-1);
    else setimage(index-1);
}

function setnext(){
    if(index == data.length-1) setimage(0);
    setimage(index+1);
}

function setimage(i){
    seen.shift(); seen.push(i);
    index = i
    const img = data[i];
    picture.innerHTML = "<a href='" + img.source + "'><img src='" + img.file + "' height=600></a><br/>" +
                        "<b>Artist:</b> " + artistlink(img) + "<br/>" +
                        "<b>Source:</b> <a href='" + img.source + "'>" + img.source + "</a>";
}

setrandom();
