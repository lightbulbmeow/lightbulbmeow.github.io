var lw = 30;
var lh = 15;

function playtest(){
    var leveldata = lw + "|" + lh + "|";
    for(var i = 0; i < tiles.length; i ++){
        var a = tiles[i];
        leveldata += a.name + "|" + a.x + "|" + a.y + "|" + a.texttype + "|" + a.direction + "|";
    }
    var winwidth = lw*24+35;
    var winheight = lh*24+110;
    window.open("game.html?" + leveldata,"null","resizable=no,width="+winwidth+",height="+winheight+",left="+Math.floor((screen.width-winwidth)/2)+",top="+Math.floor((screen.height-winheight)/2));
}

function exportlevel(){
    var leveldata = lw + "|" + lh + "|";
    for(var i = 0; i < tiles.length; i ++){
        var a = tiles[i];
        leveldata += a.name + "|" + a.x + "|" + a.y + "|" + a.texttype + "|" + a.direction + "|";
    }
    document.getElementById("leveldata").value = leveldata;
}

function importlevel(){
    if(confirm("Are you sure you want to overwrite the existing level?")){
        var leveldata = document.getElementById("leveldata").value.split("|");
        lw = Number(leveldata[0]);
        lh = Number(leveldata[1]);
        tiles = [];
        for(i = 2; i < leveldata.length - 1; i += 5){
            tiles.push(new tile(leveldata[i],Number(leveldata[i+1]),Number(leveldata[i+2]),Number(leveldata[i+3]),Number(leveldata[i+4])));
        }
        canvas.width = lw*24;
        canvas.height = lh*24;
        ctx.strokeStyle = "#333333";
        ctx.beginPath();
        for(var i = 0; i < lw; i ++){
            ctx.moveTo(i*24,0);
            ctx.lineTo(i*24,lh*24);
        }
        for(var i = 0; i < lh; i ++){
            ctx.moveTo(0,i*24);
            ctx.lineTo(lw*24,i*24);
        }
    }
}

function changesize(){
    lw = Number(document.getElementById("levelwidth").value);
    lh = Number(document.getElementById("levelheight").value);
    canvas.width = lw*24;
    canvas.height = lh*24;
    ctx.strokeStyle = "#333333";
    ctx.beginPath();
    for(var i = 0; i < lw; i ++){
        ctx.moveTo(i*24,0);
        ctx.lineTo(i*24,lh*24);
    }
    for(var i = 0; i < lh; i ++){
        ctx.moveTo(0,i*24);
        ctx.lineTo(lw*24,i*24);
    }
    
    for(var i = 0; i < tiles.length; i ++){
        var a = tiles[i];
        if(a.x >= lw*24 || a.y >= lh*24){
            tiles.splice(i,1);
            i--;
        }
    }
}

class tile{
    constructor(name,x,y,texttype,direction){
        this.name = name;
        this.x = x;
        this.y = y;
        this.texttype = texttype;
        this.direction = direction; //0=left, 1=right
    }
}

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d');

function make_base(link,x,y)
{
  base_image = new Image();
  base_image.src = "sprites/" + link + ".png";
  ctx.drawImage(base_image, x, y);
}

window.addEventListener('keydown',this.changedirec,false);

function changedirec(e){
    if(e.keyCode == 37){ direc = 0;}
    if(e.keyCode == 39){ direc = 1;}
    if(String.fromCharCode(e.keyCode) == "A"){
        for(var i = 0; i < tiles.length; i ++){
            tiles[i].x = (tiles[i].x - 24 + lw*24)%(lw * 24);
        }
    }
    if(String.fromCharCode(e.keyCode) == "D"){
        for(var i = 0; i < tiles.length; i ++){
            tiles[i].x = (tiles[i].x + 24)%(lw * 24);
        }
    }
    if(String.fromCharCode(e.keyCode) == "W"){
        for(var i = 0; i < tiles.length; i ++){
            tiles[i].y = (tiles[i].y - 24 + lh*24)%(lh * 24);
        }
    }
    if(String.fromCharCode(e.keyCode) == "S"){
        for(var i = 0; i < tiles.length; i ++){
            tiles[i].y = (tiles[i].y + 24)%(lh * 24);
        }
    }
}

var snap = 24;

function changesnap(n){
    snap = n;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: Math.round((evt.clientX - rect.left - 12)/snap)*snap,
      y: Math.round((evt.clientY - rect.top - 12)/snap)*snap
    };
}

var mousePos = {x:-24,y:-24};

canvas.addEventListener("mousemove", function(e) { 
   mousePos = getMousePos(canvas, e); 
   draw();
}); 

var direc = 1;
var tiles=[];

/*
Texttypes:
0 - Noun
1 - Is
2 - Property
3 - And
4 - Not
5 - Prefix
6 - Condition
7 - Facing
8 - Verb
9 - Direction
10 - Letters
*/

var selectedobj = "baba";
var selectedtype = 0;

function changeobject(name,texttype){
    selectedobj = name;
    selectedtype = texttype;
}

function placeobject(){
    if(mousePos.x >= lw*24 || mousePos.y >= lh*24){
        return;
    }
    if(selectedobj == "erase"){
        for(var i = 0; i < tiles.length; i ++){
            var a = tiles[i];
            if(mousePos.x > a.x - 24 & mousePos.x < a.x + 24 & mousePos.y > a.y - 24 & mousePos.y < a.y + 24){
                tiles.splice(i,1);
                i--;
            }
        }
    }else{
        tiles.push(new tile(selectedobj,mousePos.x,mousePos.y,selectedtype,direc));
    }
}

ctx.strokeStyle = "#333333";
for(var i = 0; i < lw; i ++){
    ctx.moveTo(i*24,0);
    ctx.lineTo(i*24,lh*24);
}
for(var i = 0; i < lh; i ++){
    ctx.moveTo(0,i*24);
    ctx.lineTo(lw*24,i*24);
}

function draw(){
    
    ctx.clearRect(0,0,lw*24,lh*24);
    ctx.stroke();
    
    //draw canvas and grid
    for(var i = 0; i < tiles.length; i ++){
        var a = tiles[i]
        if(a.name == "baba" || a.name == "skull" || a.name == "ghost" || a.name == "belt"){
            if(a.direction == 0){
                make_base(a.name + "_l",a.x,a.y);
            }else{
                make_base(a.name,a.x,a.y);
            }
        }else{
            make_base(a.name,a.x,a.y);
        }
    }
    
    ctx.globalAlpha = 0.5;
    if(selectedobj == "baba" || selectedobj == "skull" || selectedobj == "ghost" || selectedobj == "belt"){
        if(direc == 0){
            make_base(selectedobj + "_l",mousePos.x,mousePos.y);
        }else{
            make_base(selectedobj,mousePos.x,mousePos.y);
        }
    }else{
        make_base(selectedobj,mousePos.x,mousePos.y);
    }
    ctx.globalAlpha = 1;
}

draw();