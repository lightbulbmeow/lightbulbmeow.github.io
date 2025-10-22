// script that handles updates according to rules

function windowkill(){
    if(windowhasrules.length > 0){
        window.resizeTo(lh*24 + 35,lh*24 + 110);
        var pagecode = "";
        for(var j = 0; j < windowhasrules.length; j ++){
            pagecode += "<img src='sprites/" + windowhasrules[j] + ".png' width=" + lh*24 + " height=" + lh*24 + " style='image-rendering: optimizeSpeed;image-rendering: -moz-crisp-edges;image-rendering: -o-crisp-edges;image-rendering: -webkit-optimize-contrast;image-rendering: pixelated;image-rendering: optimize-contrast;-ms-interpolation-mode: nearest-neighbor; position:absolute;left:10;top:10;'>"
        }
        document.getElementById("entirepage").innerHTML = pagecode;
    }else{
        window.close();
    }
}

var texthasmoved = true; //if true at the end of a turn, update the rules
var windowdirection = 1;

var tilegrid = [];
var windowrules = [];
var windowconverts = [];
var windowhasrules = [];
var wonthelevel = false;

function updatelvl(condition,not){
    
    var tilecount = tiles.length;
    
    //convert object
    if(windowconverts.length > 0 & !windowrules.includes("notransform") & (windowrules.includes(condition) ^ not)){
        window.resizeTo(lh*24 + 35,lh*24 + 110);
        var pagecode = "";
        for(var i = 0; i < windowconverts.length; i ++){
            pagecode += "<img src='sprites/" + windowconverts[i] + ".png' width=" + lh*24 + " height=" + lh*24 + " style='image-rendering: optimizeSpeed;image-rendering: -moz-crisp-edges;image-rendering: -o-crisp-edges;image-rendering: -webkit-optimize-contrast;image-rendering: pixelated;image-rendering: optimize-contrast;-ms-interpolation-mode: nearest-neighbor; position:absolute;left:10;top:10;'>"
        }
        document.getElementById("entirepage").innerHTML = pagecode;
    }
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }if(a.rules.includes("notransform") || !(a.rules.includes(condition) ^ not)){
            continue;
        }
        if(a.converts.length > 0){
            if(a.name.startsWith("text_") || a.converts[0].startsWith("text_")){
                texthasmoved = true;
            }
            for(var j = 0; j < a.converts.length; j ++){
                if(a.converts[j].startsWith("text_")){
                    texthasmoved = true;
                }
                if(a.converts[j] != "empty"){
                    var b = new tile(a.converts[j],a.x,a.y,0,a.direction);
                    tiles.push(b);
                    b.yspeed = a.yspeed;
                }
            }
            tiles[i] = null;
        }
    }
    
    //follow
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.followrules.length > 0 & (a.rules.includes(condition) ^ not)){
            var nearest = null;
            var shortest = Infinity;
            var leaning = 0;
            for(var j = 0; j < tiles.length; j ++){
                if(i == j){
                    continue;
                }
                var b = tiles[j];
                if(a.followrules.includes(b.name) || (a.followrules.includes("text") & b.name.startsWith("text_"))){
                    var dist = (b.x - a.x)*(b.x - a.x) + (b.y - a.y)*(b.y - a.y);
                    if(dist < shortest){
                        leaning = Math.sign(b.x - a.x);
                        shortest = dist;
                        nearest = b;
                    }else if(dist == shortest){
                        leaning += Math.sign(b.x - a.x);
                    }
                }
            }
            if(nearest != null){
                if(leaning < 0){
                    a.direction = 0;
                }else if(leaning > 0){
                    a.direction = 1;
                }
            }
        }
    }
    
    //left and right
    if(windowrules.includes("left") & (windowrules.includes(condition) ^ not)){
        windowdirection = 0;
    }if(windowrules.includes("right") & (windowrules.includes(condition) ^ not)){
        windowdirection = 1;
    }
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.rules.includes("left") & (a.rules.includes(condition) ^ not)){
            a.direction = 0;
        }if(a.rules.includes("right") & (a.rules.includes(condition) ^ not)){
            a.direction = 1;
        }
    }

    //antigrav
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.rules.includes("antigrav")){ a.antigrav = true; }
        else{ a.antigrav = false; }
    }
    
    //each tiles movement: gravity and you(2) objects
    if(!windowrules.includes("sleep") & (windowrules.includes(condition) ^ not)){
        if(windowrules.includes("you") & windowrules.includes("you2")){
            window.moveBy(moveright - moveleft + moveright2 - moveleft2,movedown - moveup + movedown2 - moveup2);
        }else if(windowrules.includes("you")){
            window.moveBy(moveright - moveleft,movedown - moveup);
        }else if(windowrules.includes("you2")){
            window.moveBy(moveright2 - moveleft2,movedown2 - moveup2);
        }
    }
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(!(a.rules.includes(condition) ^ not)){
            continue;
        }
        //player 1 and 2 y-movement
        if(!a.rules.includes("sleep")){
            if(a.rules.includes("you") & a.rules.includes("you2")){
                if(movejump & a.isonfloor() & !a.rules.includes("stop") & !a.rules.includes("float")){
                    if(!a.antigrav){ a.yspeed = -8 }
                    else{ a.yspeed = 8 }
                }else if(a.rules.includes("stop") || a.rules.includes("float")){
                    a.yspeed = movedown - moveup + movedown2 - moveup2;
                }
            }else if(a.rules.includes("you")){
                if(movejump & a.isonfloor() & !a.rules.includes("stop") & !a.rules.includes("float")){
                    if(!a.antigrav){ a.yspeed = -8 }
                    else{ a.yspeed = 8 }
                }else if(a.rules.includes("stop") || a.rules.includes("float")){
                    a.yspeed = movedown - moveup;
                }
            }else if(a.rules.includes("you2")){
                if(movejump2 & a.isonfloor() & !a.rules.includes("stop") & !a.rules.includes("float")){
                    if(!a.antigrav){ a.yspeed = -8 }
                    else{ a.yspeed = 8 }
                }else if(a.rules.includes("stop") || a.rules.includes("float")){
                    a.yspeed = movedown2 - moveup2;
                }
            }
        }
        //
        
        if(!a.isonfloor() & !a.rules.includes("stop") & !a.rules.includes("float")){
            if(!a.antigrav){ a.yspeed += 0.5 }
            else{ a.yspeed += -0.5 }
        }
        a.movetoy(a.yspeed);
        
        //player 1 and 2 x-movement
        if(!a.rules.includes("sleep")){
            if(a.rules.includes("you") & a.rules.includes("you2")){
                a.xspeed = moveright - moveleft + moveright2 - moveleft2;
            }else if(a.rules.includes("you")){
                a.xspeed = moveright - moveleft;
            }else if(a.rules.includes("you2")){
                a.xspeed = moveright2 - moveleft2;
            }else{
                a.xspeed = 0;
            }
        }else{
            a.xspeed = 0;
        }
        a.movetox(a.xspeed);
    }
    
    //move objects
    if(!windowrules.includes("sleep") & (windowrules.includes(condition) ^ not)){
        var wmovecount = 0;
        for(var j = 0; j < windowrules.length; j ++){
            if(windowrules[j] == "move"){
                movecount += 1;
            }
        }
        if(wmovecount > 0){
            window.moveBy((windowdirection*6-3)*movecount,0);
        }
    }
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(!a.rules.includes("sleep") & (a.rules.includes(condition) ^ not)){
            var movecount = 0;
            for(var j = 0; j < a.rules.length; j ++){
                if(a.rules[j] == "move"){
                    movecount += 1;
                }
            }
            if(movecount > 0){
                a.xspeed = (a.direction*6-3)*movecount;
                a.movetox(a.xspeed);
                if(a.xspeed < 3 & a.xspeed > -3){
                    a.direction = 1 - a.direction;
                }
            }
        }
    }
    
    //bounce
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.rules.includes("bounce")){
            var idinside = a.idinside();
            for(var j = 0; j < idinside.length; j ++){
                var b = tiles[idinside[j]];
                if(b.rules.includes(condition) ^ not){
                    b.yspeed = - b.yspeed;
                    if(!b.antigrav){ b.y = a.y - 24 }
                    else{ b.y = a.y + 24 }
                    b.movetoy(b.yspeed);
                }
            }
        }
    }
    
    //open and shut
    if(windowrules.includes("open") & !windowrules.includes("safe") & (windowrules.includes(condition) ^ not)){
        for(var i = 0; i < tilecount; i ++){
            var a = tiles[i];
            if(a == null){
                continue;
            }
            if(a.rules.includes("shut")){
                windowkill();
            }
        }
    }
    if(windowrules.includes("shut") & !windowrules.includes("safe") & (windowrules.includes(condition) ^ not)){
        for(var i = 0; i < tilecount; i ++){
            var a = tiles[i];
            if(a == null){
                continue;
            }
            if(a.rules.includes("open")){
                windowkill();
            }
        }
    }
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.rules.includes("open") & (a.rules.includes(condition) ^ not)){
            if(a.rules.includes("shut") & !a.rules.includes("safe")){
                a.killme(i);
                screenshake();
            }
            var idinside = a.idinside();
            for(var j = 0; j < idinside.length; j ++){
                var b = tiles[idinside[j]];
                if(b.rules.includes("shut")){
                    if(a.rules.includes("safe") & !b.rules.includes("safe")){
                        b.killme(idinside[j]);
                        screenshake();
                    }else if(!a.rules.includes("safe") & b.rules.includes("safe")){
                        a.killme(i);
                        screenshake();
                        break;
                    }else{
                        a.killme(i);
                        b.killme(idinside[j]);
                        screenshake();
                        break;
                    }
                }
            }
        }
    }
    
    //eat me
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.eatrules.length > 0 & (a.rules.includes(condition) ^ not)){
            var idinside = a.idinside();
            for(var j = 0; j < idinside.length; j ++){
                var b = tiles[idinside[j]];
                if((a.eatrules.includes(b.name) || (a.eatrules.includes("text") & b.name.startsWith("text_"))) & !b.rules.includes("safe")){
                    b.killme(idinside[j]);
                }
            }
        }
    }
    
    //destroyweak objects
    if(windowrules.includes("weak") & !windowrules.includes("safe") & (windowrules.includes(condition) ^ not)){
        windowkill();
    }
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.rules.includes("weak") & !a.rules.includes("safe") & (a.rules.includes(condition) ^ not)){
            if(a.idinside().length > 0 || a.x < 0 || a.x >= (lw - 1)*24){
                a.killme(i);
                screenshake();
            }
        }
    }
    
    //kill player if it touches defeat object
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if((a.rules.includes("you") || a.rules.includes("you2")) & !a.rules.includes("safe") & (a.rules.includes(condition) ^ not)){
            if(a.rules.includes("defeat") || windowrules.includes("defeat")){
                a.killme(i);
                screenshake();
            }
            var idinside = a.idinside();
            for(var j = 0; j < idinside.length; j ++){
                var b = tiles[idinside[j]];
                if(b.rules.includes("defeat") & a.isinside(b)){
                    a.killme(i);
                    screenshake();
                }
            }
        }
    }
    
    //sink everything on top of a sink object
    if(windowrules.includes("sink") & !windowrules.includes("safe") & (windowrules.includes(condition) ^ not)){
        windowkill();
    }
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        var overlaps = false;
        if(a.rules.includes("sink") & !a.rules.includes("safe") & (a.rules.includes(condition) ^ not)){
            var idinside = a.idinside();
            for(var j = 0; j < idinside.length; j ++){
                var b = tiles[idinside[j]];
                if(b.isinside(a)){
                    b.killme(idinside[j]);
                    overlaps = true;
                }
            }
        }
        if(overlaps){
            a.killme(i);
            screenshake();
        }
    }
    
    //melt if it touches hot
    if(windowrules.includes("melt") & !windowrules.includes("safe") & (windowrules.includes(condition) ^ not)){
        if(windowrules.includes("hot")){
            windowkill();
        }
        for(var i = 0; i < tilecount; i ++){
            var a = tiles[i];
            if(a == null){
                continue;
            }
            if(a.rules.includes("hot")){
                windowkill();
            }
        }
    }
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.rules.includes("melt") & !a.rules.includes("safe") & (a.rules.includes(condition) ^ not)){
            if(windowrules.includes("hot") || a.rules.includes("hot")){
                a.killme(i);
                screenshake();
            }else{
                if(a.rules.includes("hot")){
                    a.killme(i);
                    screenshake();
                }
                var idinside = a.idinside();
                for(var j = 0; j < idinside.length; j ++){
                    var b = tiles[idinside[j]];
                    if(b.rules.includes("hot") & a.isinside(b)){
                        a.killme(i);
                        screenshake();
                    }
                }
            }
        }
    }
    
    //you win!
    if(!wonthelevel){
        var youexist = false;
        for(var i = 0; i < tilecount; i ++){
            var a = tiles[i];
            if(a == null){
                continue;
            }
            if(a.rules.includes("you") || a.rules.includes("you2") & (a.rules.includes(condition) ^ not)){
                youexist = true;
                if(a.rules.includes("win")){
                    win();
                    break;
                }
                var idinside = a.idinside();
                for(var j = 0; j < idinside.length; j ++){
                    var b = tiles[idinside[j]];
                    if(b.rules.includes("win") & a.isinside(b)){
                        win();
                        break;
                    }
                }
                if(wonthelevel) break;
            }
        }
        if(youexist & windowrules.includes("win")){
            win();
        }
    }
    //
    
    //done objects
    if(windowrules.includes("done") & (windowrules.includes(condition) ^ not)){
        window.close();
    }
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.rules.includes("done") & (a.rules.includes(condition) ^ not)){
            if(a.name.startsWith("text_")){
                texthasmoved = true;
            }
            doneobjects.push(new doneobject(a.name,a.x,a.y));
            tiles[i] = null;
        }
    }
}

async function win(){
    pause = true;
    wonthelevel = true;
    validwin = false;
    var tilecount = tiles.length;
    for(var i = 0; i < tilecount; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.rules.includes("you") || a.rules.includes("you2")){
            youexist = true;
            if(a.rules.includes("win")){
                validwin = true;
                break;
            }
            var idinside = a.idinside();
            for(var j = 0; j < idinside.length; j ++){
                var b = tiles[idinside[j]];
                if(b.rules.includes("win") & a.isinside(b)){
                    validwin = true;
                    break;
                }
            }
            if(validwin) break;
        }
    }
    if(youexist & windowrules.includes("win")){
        validwin = true;
    }
    if(validwin){
        console.log(windowurl.slice(windowurl.indexOf("?")+1));
        await new Promise(r => setTimeout(r, 1000));
        window.close();
    }
}
