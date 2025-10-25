// script handling game controls and display

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var windowurl = window.location.href;
var leveldata = windowurl.slice(windowurl.indexOf("?")+1).split("|");
var lw = Number(leveldata[0]);
var lh = Number(leveldata[1]);
var tiles = [];
var allobjects = [];
var preloadedimages = Object();

function preload(link){
    if(!Object.hasOwn(preloadedimages, link)){
        base_image = new Image();
        base_image.src = "sprites/" + link + ".png";
        preloadedimages[link] = base_image;
    }
}

for(i = 2; i < leveldata.length - 1; i += 5){
    var objname = leveldata[i];
    var texttype = Number(leveldata[i+3]);
    tiles.push(new tile(objname,Number(leveldata[i+1]),Number(leveldata[i+2]),texttype,Number(leveldata[i+4])));
    if(objname.startsWith("text_")){
        var surname = objname.slice(5);
        if(texttype == 0 & surname != "all" & surname != "empty" & surname != "group" & surname != "text" & !allobjects.includes(surname)){
            allobjects.push(surname);
        }
    }else if(!allobjects.includes(objname)){
        allobjects.push(objname);
    }
}

for(const objname of allobjects){
    preload(objname);
    preload("text_" + objname);
    if(objname == "baba" || objname == "skull" || objname == "ghost" || objname == "belt" || objname == "keke"){
        preload(objname + "_l")
    }
}
preload("youwin");
preload("youwin2");
preload("gamepause");

canvas.width = lw*24;
canvas.height = lh*24;

function make_base(link,x,y)
{
    preload(link);
    ctx.drawImage(preloadedimages[link], x, y);
}

var moveleft = 0;
var movejump = false;
var moveright = 0;
var movedown = 0;
var moveup = 0;
var moveleft2 = 0;
var movejump2 = false;
var moveright2 = 0;
var movedown2 = 0;
var moveup2 = 0;
var slowmovejump = false;
var slowmovejump2 = false;
var pause = false;
var validwin = false;

window.addEventListener('keydown',this.movechar,false);
window.addEventListener('keyup',this.stopchar,false);

function movechar(e){
    if(e.keyCode == 37){ moveleft = 3}
    if(e.keyCode == 38){ movejump = true; moveup = 3}
    if(e.keyCode == 39){ moveright = 3}
    if(e.keyCode == 40){ movedown = 3}
    if(String.fromCharCode(e.keyCode) == "A"){ moveleft2 = 3}
    if(String.fromCharCode(e.keyCode) == "W"){ movejump2 = true; moveup2 = 3}
    if(String.fromCharCode(e.keyCode) == "D"){ moveright2 = 3}
    if(String.fromCharCode(e.keyCode) == "S"){ movedown2 = 3}
    if(String.fromCharCode(e.keyCode) == "R"){ window.location.reload()}
    if(String.fromCharCode(e.keyCode) == "P"){ if(!wonthelevel) pause ^= true}
    if(String.fromCharCode(e.keyCode) == "Z"){
        if(undos.length > 1){
            tiles = undos.pop();
        }else{
            tiles = undos[0];
        }
        undotime = 50;
    }
}

function stopchar(e){
    if(e.keyCode == 37){ moveleft = 0}
    if(e.keyCode == 38){ moveup = 0}
    if(e.keyCode == 39){ moveright = 0}
    if(e.keyCode == 40){ movedown = 0}
    if(String.fromCharCode(e.keyCode) == "A"){ moveleft2 = 0}
    if(String.fromCharCode(e.keyCode) == "W"){ moveup2 = 0}
    if(String.fromCharCode(e.keyCode) == "D"){ moveright2 = 0}
    if(String.fromCharCode(e.keyCode) == "S"){ movedown2 = 0}
}

var shakeduration = 0;
var origwinx = 0;
var origwiny = 0;

function screenshake(){
    origwinx = window.screenX;
    origwiny = window.screenY;
    shakeduration = 5;
}

var doneobjects = [];

class doneobject{
    constructor(name,x,y){
        this.name = name;
        this.x = x;
        this.y = y;
        this.rotatedir = (Math.random()*6 - 3)*Math.PI/180;
        this.rotation = 0;
        this.doneduration = 60;
        this.alpha = 1;
    }
}

var slowturn = true;

var undos = [];
var undotime = 0;

function draw(){

    //simulate the shake animation
    if(!pause){
        if(shakeduration > 0){
            window.moveTo(origwinx+Math.round(Math.random()*6)-3,origwiny+Math.round(Math.random()*6)-3);
            shakeduration --;
        }
        //simulate the done animation
        for(var i = 0; i < doneobjects.length; i ++){
            var a = doneobjects[i];
            if(a.doneduration > 0){
                a.doneduration --;
                a.rotation += a.rotatedir;
                a.alpha -= 1/60;
                a.y -= (60-a.doneduration)/10;
            }
        }
    }

    if(undotime <= 0){
        undotime = 50;
        var tilesclone = [];
        for(var i = 0; i < tiles.length; i ++){
            var a = tiles[i];
            if(a == null){
                continue;
            }
            var aclone = new tile(a.name,a.x,a.y,a.texttype,a.direction);
            aclone.xspeed = a.xspeed;
            aclone.yspeed = a.yspeed;
            tilesclone.push(aclone);
        }
        undos.push(tilesclone);
    }
    if(!pause){
        undotime--;
    }

    //update tilegrid;
    tilegrid = [];
    for(var i = 0; i < lw; i ++){
        var currow = [];
        for(var j = 0; j < lh; j ++){
            currow.push([]);
        }
        tilegrid.push(currow);
    }
    for(var i = 0; i < tiles.length; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        tilegrid[Math.round(a.x/24)][Math.round(a.y/24)].push(i);
    }

    //rule parse and interpret
    //fix TextHasMoved soon.
    if(texthasmoved){
        ruleparse();
        ruleinterpret();
    }
    texthasmoved = true; //change to false

    if(pause){
        updatelvl("zawarudo",false);
    }else{
        if(movejump){
            slowmovejump = true;
        }
        if(movejump2){
            slowmovejump2 = true;
        }
        if(slowturn){
            if(slowmovejump){
                slowmovejump = movejump;
                movejump = true;
            }
            if(slowmovejump2){
                slowmovejump2 = movejump2;
                movejump2 = true;
            }
            updatelvl(null,true);
            movejump = slowmovejump;
            movejump2 = slowmovejump2;
            slowmovejump = false;
            slowmovejump2 = false;
        }else{
            updatelvl("slow",true);
        }
        slowturn ^= true;

        updatelvl("fast",false);
    }

    movejump = false;
    movejump2 = false;

    //draw canvas
    ctx.clearRect(0,0,24*lw,24*lh);

    //TEST ONLY!!!
    /*ctx.fillStyle="#333333";
    for(var i = 0; i < 40; i ++){
        for(var j = 0; j < 20; j ++){
            if(tilegrid[i][j].length > 0){
                ctx.fillRect(i*24,j*24,24,24);
            }
        }
    }*/
    //

    if(!windowrules.includes("hide")){
        for(var i = 0; i < tiles.length; i ++){
            var a = tiles[i]
            if(a == null){
                continue;
            }
            if(a.rules.includes("hide")){
                continue;
            }
            if(pause & !wonthelevel & !a.rules.includes("zawarudo")){
                ctx.globalAlpha = 0.5;
            }else{
                ctx.globalAlpha = 1;
            }
            if(a.name == "baba" || a.name == "skull" || a.name == "ghost" || a.name == "belt" || a.name == "keke"){
                spritename = a.name
                if(a.direction == 0){
                    spritename += "_l"
                }
                if(a.rules.includes("sleep") & (a.name == "baba" || a.name == "skull" || a.name == "ghost" || a.name == "keke")){
                    spritename += "_s"
                }
                make_base(spritename,a.x,a.y);
            }else if(a.name.startsWith("text") & a.activated == false){
                ctx.globalAlpha /= 2;
                make_base(a.name,a.x,a.y);
                ctx.globalAlpha *= 2;
            }else{
                make_base(a.name,a.x,a.y);
            }
        }
        for(var i = 0; i < doneobjects.length; i ++){
            var a = doneobjects[i];
            if(a.alpha > 0){
                //ctx.save();
                ctx.translate(a.x+12,a.y+12);
                ctx.rotate(a.rotation);
                ctx.globalAlpha *= a.alpha;
                make_base(a.name,-12,-12);
                ctx.globalAlpha /= 1;
                ctx.rotate(-a.rotation);
                ctx.translate(-a.x-12,-a.y-12);
                //ctx.restore();
            }
        }
    }

    if(pause && !wonthelevel){
        ctx.globalAlpha = 0.5;
        make_base("gamepause",lw*12-200,lh*12-50);
    }

    if(wonthelevel){
        if(validwin){
            make_base("youwin",lw*12-150,lh*12-90);
        }else{
            make_base("youwin2",lw*12-150,lh*12-90);
        }
    }
}

async function loop(){
    while(true){
        await new Promise(r => setTimeout(r, 20));
        window.requestAnimationFrame(draw);
    }
}

loop();
