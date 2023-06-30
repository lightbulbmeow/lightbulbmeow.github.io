class Boundary{
    constructor(x1,y1,x2,y2){
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

class CircBoundary{
    constructor(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
    }
}

class Ray{
    constructor(x,y,dirx,diry){
        this.x = x;
        this.y = y;
        this.dirx = dirx;
        this.diry = diry;
    }
    cast(bound){
        var x1 = bound.x1;
        var y1 = bound.y1;
        var x2 = bound.x2;
        var y2 = bound.y2;
        var x3 = this.x;
        var y3 = this.y;
        var x4 = x3+this.dirx;
        var y4 = y3+this.diry;
        var denom = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
        if(denom == 0){
            return undefined;
        }
        var tnum = (x1-x3)*(y3-y4)-(y1-y3)*(x3-x4);
        var unum = -(x1-x2)*(y1-y3)+(y1-y2)*(x1-x3);
        if(tnum * denom < 0  || (tnum - denom)*denom > 0 || unum * denom < 0){
            return undefined;
        }
        return {
            x: x1+tnum*(x2-x1)/denom,
            y: y1+tnum*(y2-y1)/denom
        }
    }
    castcirc(bound){
        var x1 = this.x;
        var y1 = this.y;
        var x2 = x1+this.dirx;
        var y2 = y1+this.diry;
        var xc = bound.x;
        var yc = bound.y;
        var r = bound.r;
        var dx = x2-x1;
        var dy = y2-y1;
        var dr2 = dx*dx+dy*dy;
        var det = (x1-xc)*(y2-yc)-(x2-xc)*(y1-yc);
        var disc = r*r*dr2-det*det;
        if(disc < 0){
            return [undefined,undefined];
        }
        var point1 = {x: (det*dy+dx*Math.sqrt(disc))/dr2+xc, y:(-det*dx+dy*Math.sqrt(disc))/dr2+yc};
        var point2 = {x: (det*dy-dx*Math.sqrt(disc))/dr2+xc, y:(-det*dx-dy*Math.sqrt(disc))/dr2+yc};
    if((point1.x < x1 & x1 < x2) || (point1.x > x1 & x1 > x2) || (point1.y < y1 & y1 < y2) || (point1.y > y1 & y1 > y2)){
            point1 = undefined;
        }
        if((point2.x < x1 & x1 < x2) || (point2.x > x1 & x1 > x2) || (point2.y < y1 & y1 < y2) || (point2.y > y1 & y1 > y2)){
            point2 = undefined;
        }
        return [point1,point2];
    }
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var walls = [];
walls.push(new Boundary(0,0,500,0));
walls.push(new Boundary(0,500,500,500));
walls.push(new Boundary(0,0,0,500));
walls.push(new Boundary(500,0,500,500));
var circles = [];

for(var i = 0; i < 5; i ++){
    var x1 = Math.random()*500;
    var y1 = Math.random()*500;
    var width = Math.random()*200;
    var height = Math.random()*200;
    var ang = radians(Math.random()*360);
    var wx = width*Math.cos(ang);
    var wy = width*Math.sin(ang);
    var hx = -height*Math.sin(ang);
    var hy = height*Math.cos(ang);
    walls.push(new Boundary(x1,y1,x1+wx,y1+wy));
    walls.push(new Boundary(x1,y1,x1+hx,y1+hy));
    walls.push(new Boundary(x1+wx+hx,y1+wy+hy,x1+wx,y1+wy));
    walls.push(new Boundary(x1+wx+hx,y1+wy+hy,x1+hx,y1+hy));
    
    var x = Math.random()*500;
    var y = Math.random()*500;
    var r = Math.random()*100;
    circles.push(new CircBoundary(x,y,r));
}

new Boundary(50,50,100,150);

var curpos = {x:250,y:250};
var curdeg = 0;
var spinspeed = 0;
var lspeed = 0;
var uspeed = 0;
var rspeed = 0;
var dspeed = 0;
var speedmult = 1;
var showmap = false;

function movechar(e){
    if(String.fromCharCode(e.keyCode) == "A" || e.keyCode == 37){ lspeed = 0.5; }
    if(String.fromCharCode(e.keyCode) == "W" || e.keyCode == 38){ uspeed = 0.5; }
    if(String.fromCharCode(e.keyCode) == "D" || e.keyCode == 39){ rspeed = 0.5; }
    if(String.fromCharCode(e.keyCode) == "S" || e.keyCode == 40){ dspeed = 0.5; }
    if(e.keyCode == 16){ speedmult = 2; }
    if(String.fromCharCode(e.keyCode) == "Z"){ showmap ^= true; }
}

function stopchar(e){
    if(String.fromCharCode(e.keyCode) == "A" || e.keyCode == 37){ lspeed = 0; }
    if(String.fromCharCode(e.keyCode) == "W" || e.keyCode == 38){ uspeed = 0; }
    if(String.fromCharCode(e.keyCode) == "D" || e.keyCode == 39){ rspeed = 0; }
    if(String.fromCharCode(e.keyCode) == "S" || e.keyCode == 40){ dspeed = 0; }
    if(e.keyCode == 16){ speedmult = 1; }
}

function radians(a){
    return(Math.PI*a/180);
}

window.addEventListener('keydown',this.movechar,false);
window.addEventListener('keyup',this.stopchar,false);

var fov = 500
var bh = 25
var br = 25
var lw = 1;

function fieldofview(x){
    fov = x;
}

function blockheight(x){
    bh = x;
}

function brightness(x){
    br = x;
}

function linewidthh(x){
    lw = x+100;
}

document.body.addEventListener("mousemove", function (e) {
    curdeg += e.movementX/5;
});

function draw(){
    
    curpos.x += speedmult*lspeed*Math.cos(radians(curdeg-90));
    curpos.x += speedmult*uspeed*Math.cos(radians(curdeg));
    curpos.x += speedmult*rspeed*Math.cos(radians(curdeg+90));
    curpos.x += speedmult*dspeed*Math.cos(radians(curdeg+180));
    curpos.y += speedmult*lspeed*Math.sin(radians(curdeg-90));
    curpos.y += speedmult*uspeed*Math.sin(radians(curdeg));
    curpos.y += speedmult*rspeed*Math.sin(radians(curdeg+90));
    curpos.y += speedmult*dspeed*Math.sin(radians(curdeg+180));
    
    ctx.clearRect(0,0,1000,500);
    
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    
    //Show map
    if(showmap){
        //draw walls
        for(var i = 0; i < walls.length; i ++){
            ctx.beginPath();
            ctx.moveTo(walls[i].x1+500,walls[i].y1);
            ctx.lineTo(walls[i].x2+500,walls[i].y2);
            if(i < 4){
                ctx.strokeStyle = "#ff0000";
            }else{
                ctx.strokeStyle = "#ffffff";
            }
            ctx.stroke();
        }
        //draw circles
        for(var i = 0; i < circles.length; i ++){
            ctx.beginPath();
            ctx.arc(circles[i].x+500,circles[i].y,circles[i].r,0,2*Math.PI);
            ctx.strokeStyle = "#00ffff";
            ctx.stroke();
        }
    }
    //
    
    var lww = lw;
    
    for(var i = -250; i < 250; i += lww){
        var player = new Ray(curpos.x,curpos.y,Math.cos(radians(curdeg))*fov-Math.sin(radians(curdeg))*i,Math.sin(radians(curdeg))*fov+Math.cos(radians(curdeg))*i);
        var closest = null;
        var shortest = Infinity;
        var walltype = 0; //0: normal, 1: edge, 2:circle
        for(var j = 0; j < walls.length; j ++){
            var pt = player.cast(walls[j]);
            if(pt != undefined){
                var dist = (pt.x - player.x)*(pt.x - player.x) + (pt.y - player.y)*(pt.y - player.y);
                if(dist < shortest){
                    closest = pt;
                    shortest = dist;
                    if(j < 4){
                        walltype = 1;
                    }else{
                        walltype = 0;
                    }
                }
            }
        }
        for(var j = 0; j < circles.length; j ++){
            var pt = player.castcirc(circles[j]);
            for(var k=0; k < 2; k ++){
                if(pt[k] != undefined){
                    var dist = (pt[k].x - player.x)*(pt[k].x - player.x) + (pt[k].y - player.y)*(pt[k].y - player.y);
                    if(dist < shortest){
                        closest = pt[k];
                        shortest = dist;
                        walltype = 2;
                    }
                }
            }
        }
        ctx.beginPath();
        ctx.moveTo(i+250,250+500/Math.sqrt(shortest)*bh*Math.sqrt(i*i/(fov*fov)+1));
        ctx.lineTo(i+250,250-500/Math.sqrt(shortest)*bh*Math.sqrt(i*i/(fov*fov)+1));
        var gray = 500/Math.sqrt(shortest)*br;
        if(walltype == 0){
            ctx.strokeStyle = "rgb(" + gray + "," + gray + "," + gray + ")";
        }else if(walltype == 1){
            ctx.strokeStyle = "rgb(" + gray + ",0,0)";
        }else{
            ctx.strokeStyle = "rgb(0," + gray + "," + gray + ")";
        }
        ctx.stroke();
        
        //draw player if showmap
        if(showmap){
            ctx.beginPath();
            ctx.moveTo(player.x+500,player.y);
            if(closest != null){
                ctx.lineTo(closest.x+500,closest.y);
            }
            ctx.strokeStyle = "#aaaaaa";
            ctx.stroke();
        }
        //
    }
    
    //draw player itself
    if(showmap){
        ctx.beginPath();
        ctx.rect(player.x+500-3,player.y-3,6,6);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
    }
    //
    
    window.requestAnimationFrame(draw);
}

document.body.addEventListener("click", function (e) {
    window.requestAnimationFrame(draw);
    document.body.requestPointerLock();
});
