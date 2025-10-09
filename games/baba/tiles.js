// script handling the physics

function smaller(a,b){                //return the number with the smaller absolute value
    if(Math.abs(a) < Math.abs(b)){    //used for determining xspeed/yspeed of objects when it hits solids
        return a;
    }else{
        return b;
    }
}

class tile{
    constructor(name,x,y,texttype,direction){
        this.name = name;
        this.x = x;
        this.y = y;
        this.yspeed = 0;
        this.xspeed = 0;
        this.texttype = texttype;
        this.direction = direction; //0=left, 1=right
        this.activated = false;
        this.rules = [];
        this.hasrules = [];
        this.eatrules = [];
        this.followrules = [];
        this.converts = [];
        this.antigrav = false;
    }
    idaround(){ //not including itself
        var tilex = Math.floor(this.x / 24);
        var tiley = Math.floor(this.y / 24);
        var tilearound = [];
        for(var i = -2; i <= 2; i ++){
            if(tilex+i >= 0 & tilex+i <= lw-1){
                for(var j = -2; j <= 2; j ++){
                    if(tiley+j >= 0 & tiley+j <= lh-1){
                        for(var k = 0; k < tilegrid[tilex+i][tiley+j].length; k ++){
                            var id = tilegrid[tilex+i][tiley+j][k];
                            if(tiles[id] == null){
                                continue;
                            }
                            if(this != id){
                                tilearound.push(id);
                            }
                        }
                    }
                }
            }
        }
        return tilearound;
    }
    idinside(){ //not indlucding itself
        var tilex = Math.floor(this.x / 24);
        var tiley = Math.floor(this.y / 24);
        var tileinside = [];
        for(var i = -2; i <= 2; i ++){
            if(tilex+i >= 0 & tilex+i <= lw-1){
                for(var j = -2; j <= 2; j ++){
                    if(tiley+j >= 0 & tiley+j <= lh-1){
                        for(var k = 0; k < tilegrid[tilex+i][tiley+j].length; k ++){
                            var id = tilegrid[tilex+i][tiley+j][k];
                            if(tiles[id] == null){
                                continue;
                            }
                            if(this != tiles[id] & this.isinside(tiles[id])){
                                tileinside.push(id);
                            }
                        }
                    }
                }
            }
        }
        return tileinside;
    }
    isonfloor(){
        if(!this.antigrav){
            if(this.y >= 24*(lh - 1)){
                return true;
            }
            var idaround = this.idaround();
            for(var i = 0; i < idaround.length; i ++){
                var a = tiles[idaround[i]];
                if((a.rules.includes("stop") || a.rules.includes("push") || a.rules.includes("pull") || a.rules.includes("platform")) & this.x > a.x-24 & this.x < a.x + 24 & this.y >= a.y-24 & this.y < a.y){
                    return true;
                }
            }
            return false;
        }else{
            if(this.y <= 0){
                return true;
            }
            var idaround = this.idaround();
            for(var i = 0; i < idaround.length; i ++){
                var a = tiles[idaround[i]];
                if((a.rules.includes("stop") || a.rules.includes("push") || a.rules.includes("pull") || a.rules.includes("platform")) & this.x > a.x-24 & this.x < a.x + 24 & this.y <= a.y+24 & this.y > a.y){
                    return true;
                }
            }
            return false;
        }
    }
    isinside(a){
        if(this.x > a.x-24 & this.x < a.x + 24 & this.y > a.y-24 & this.y < a.y + 24){
            return true;
        }
        return false;
    }
    istouching(a){
        if(this.x >= a.x-24 & this.x <= a.x + 24 & this.y >= a.y-24 & this.y <= a.y + 24){
            return true;
        }
        return false;
    }
    canmovex(dx){
        var res = dx;
        if(dx == 0){
            return 0;
        }
        if(this.x + dx > 24*(lw - 1) & !(this.rules.includes("weak") & !this.rules.includes("safe"))){
            res = smaller(res,24*(lw-1) - this.x);
            if(windowrules.includes("push")){
                window.moveBy(dx,0);
            }
        }if(this.x + dx < 0 & !(this.rules.includes("weak") & !this.rules.includes("safe"))){
            res = smaller(res,-this.x);
            if(windowrules.includes("push")){
                window.moveBy(dx,0);
            }
        }
        this.x += dx;
        var idinside = this.idinside();
        for(var i = 0; i < idinside.length; i ++){
            var checktile = tiles[idinside[i]];
            if((checktile.x - this.x)*dx > 0){
                if(!((this.rules.includes("open") & checktile.rules.includes("shut") & !(this.rules.includes("safe") & checktile.rules.includes("safe"))) || (this.rules.includes("shut") & checktile.rules.includes("open") & !(this.rules.includes("safe") & checktile.rules.includes("safe"))) || (this.rules.includes("weak") & !this.rules.includes("safe")) || (checktile.rules.includes("weak") & !checktile.rules.includes("safe")) || ((this.eatrules.includes(checktile.name) || (this.eatrules.includes("text") & checktile.name.startsWith("text_"))) & !checktile.rules.includes("safe")) || ((checktile.eatrules.includes(this.name) || (checktile.eatrules.includes("text") & this.name.startsWith("text_"))) & !this.rules.includes("safe")))){
                    if((checktile.rules.includes("stop") || checktile.rules.includes("pull")) & !checktile.rules.includes("push")){
                        res = smaller(res,checktile.x - (this.x - dx) - Math.sign(dx)*24);
                    }
                    if(checktile.rules.includes("oneway") & !checktile.rules.includes("push")){
                        if(this.x - dx < checktile.x & dx > 0 & checktile.direction == 0){
                            res = smaller(res,checktile.x - (this.x - dx) - Math.sign(dx)*24);
                        }
                        if(this.x - dx > checktile.x & dx < 0 & checktile.direction == 1){
                            res = smaller(res,checktile.x - (this.x - dx) - Math.sign(dx)*24);
                        }
                    }
                    if(checktile.rules.includes("push")){
                        res = smaller(res,checktile.x - (this.x - dx) - Math.sign(dx)*24 + checktile.canmovex(dx));
                    }
                }
            }
        }
        this.x -= dx;
        return res;
    }
    movetox(dx){
        this.xspeed = this.canmovex(dx);
        if(this.name.startsWith("text_") & this.xspeed != 0){
            texthasmoved = true;
        }
        this.x += this.xspeed;
        if(this.xspeed < 0 & !this.rules.includes("right")){
            this.direction = 0;
        }else if(this.xspeed > 0 & !this.rules.includes("left")){
            this.direction = 1;
        }
        var idaround = this.idaround();
        for(var i = 0; i < idaround.length; i ++){
            var checktile = tiles[idaround[i]];
            if(!((this.rules.includes("open") & checktile.rules.includes("shut") & !(this.rules.includes("safe") & checktile.rules.includes("safe"))) || (this.rules.includes("shut") & checktile.rules.includes("open") & !(this.rules.includes("safe") & checktile.rules.includes("safe"))))){
                if(this.isinside(checktile) & (checktile.rules.includes("swap") || this.rules.includes("swap"))){
                    checktile.x -= this.xspeed;
                }else if(this.isinside(checktile) & this.x < checktile.x & dx > 0 & checktile.rules.includes("push")){
                    checktile.movetox(checktile.canmovex(dx));
                }else if(this.isinside(checktile) & this.x > checktile.x & dx < 0 & checktile.rules.includes("push")){
                    checktile.movetox(checktile.canmovex(dx));
                }else if(this.x - this.xspeed == checktile.x + 24 & this.y > checktile.y-24 & this.y < checktile.y + 24 & dx > 0 & checktile.rules.includes("pull")){
                    checktile.movetox(checktile.canmovex(dx));
                }else if(this.x - this.xspeed == checktile.x - 24 & this.y > checktile.y-24 & this.y < checktile.y + 24 & dx < 0 & checktile.rules.includes("pull")){
                    checktile.movetox(checktile.canmovex(dx));
                }
            }
        }
    }
    canmovey(dy){
        var res = dy;
        if(dy == 0){
            return 0;
        }
        if(this.y + dy > 24*(lh - 1)){
            res = 24*(lh-1) - this.y;
        }if(this.y + dy < 0){
            res = -this.y;
        }
        this.y += dy;
        var idinside = this.idinside();
        for(var i = 0; i < idinside.length; i ++){
            var checktile = tiles[idinside[i]];
            if((checktile.y - this.y)*dy > 0){
                if(!((this.rules.includes("open") & checktile.rules.includes("shut") & !(this.rules.includes("safe") & checktile.rules.includes("safe"))) || (this.rules.includes("shut") & checktile.rules.includes("open") & !(this.rules.includes("safe") & checktile.rules.includes("safe"))) || (this.rules.includes("weak") & !this.rules.includes("safe") & dy < 0) || (checktile.rules.includes("weak") & !checktile.rules.includes("safe") & dy > 0) || ((this.eatrules.includes(checktile.name) || (this.eatrules.includes("text") & checktile.name.startsWith("text_"))) & !checktile.rules.includes("safe")) || ((checktile.eatrules.includes(this.name) || (checktile.eatrules.includes("text") & this.name.startsWith("text_"))) & !this.rules.includes("safe")))){
                    if((checktile.rules.includes("stop") || checktile.rules.includes("pull")) & !checktile.rules.includes("push")){
                        res = smaller(res,checktile.y - (this.y - dy) - Math.sign(dy)*24);
                    }
                    if(checktile.rules.includes("platform") & !checktile.rules.includes("push")){
                        if(this.y - dy < checktile.y & dy > 0){
                            res = smaller(res,checktile.y - (this.y - dy) - Math.sign(dy)*24);
                        }
                    }
                    if(checktile.rules.includes("push")){
                        res = smaller(res,checktile.y - (this.y - dy) - Math.sign(dy)*24 + checktile.canmovey(dy));
                    }
                }
            }
        }
        this.y -= dy;
        return res;
    }
    movetoy(dy){
        this.yspeed = this.canmovey(dy);
        if(this.name.startsWith("text_") & this.yspeed != 0){
            texthasmoved = true;
        }
        this.y += this.yspeed;
        if(this.rules.includes("stop") || this.rules.includes("float")){
            this.yspeed = 0;
        }
        var idaround = this.idaround();
        for(var i = 0; i < idaround.length; i ++){
            var checktile = tiles[idaround[i]];
            if(!((this.rules.includes("open") & checktile.rules.includes("shut") & !(this.rules.includes("safe") & checktile.rules.includes("safe"))) || (this.rules.includes("shut") & checktile.rules.includes("open") & !(this.rules.includes("safe") & checktile.rules.includes("safe"))))){
                if(this.isinside(checktile) & this.y < checktile.y & dy > 0 & checktile.rules.includes("push")){
                    checktile.yspeed = checktile.canmovey(dy);
                    checktile.movetoy(checktile.yspeed);
                }else if(this.isinside(checktile) & this.y > checktile.y & dy < 0 & checktile.rules.includes("push")){
                    checktile.yspeed = checktile.canmovey(dy);
                    checktile.movetoy(checktile.yspeed);
                }
            }
        }
    }
    killme(id){
        if(this.name.startsWith("text_")){
            texthasmoved = true;
        }
        if(this.hasrules.length > 0){
            this.name = this.hasrules[0];
            for(var j = 1; j < this.hasrules.length; j ++){
                tiles.push(new tile(this.hasrules[j],a.x,a.y,0,a.direction));
            }
            this.rules = [];
            this.hasrules = [];
            this.eatrules = [];
            this.followrules = [];
        }else{
            tiles[id] = null;
        }
    }
}
