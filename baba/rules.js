class ruletile{
    constructor(name,texttype,id){
        this.name = name;
        this.texttype = texttype;
        this.id = id;
    }       
}

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

function subsetcheck(a,b){ //check if a is a subset of b
    var i = -1;
    for(var k = 0; k < b.length; k ++){
        if(b[k].id == a[0].id){
            i = k;
            break;
        }
    }
    if(i > -1){
        for(var j = 1; j < a.length; j ++){
            if(i + j > b.length){
                return false;
            }else if(b[i + j].id != a[j].id){
                return false;
            }
        }
        return true;
    }else{
        return false;
    }
}

      //Texttypes: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9    -1. not a rule, -2. rule is complete
var adjmatrix = [[ 1,-1,-1,-1, 0, 2,-1,-1,-1,-1], //0. start
                 [-1, 7,-1, 3, 6,-1, 4, 5, 8,-1], //1. selector (no-cond)
                 [ 1,-1,-1, 9, 3,-1,-1,-1,-1,-1], //2. prefix
                 [ 1,-1,-1,-1, 3,-1,-1,-1,-1,-1], //3. to-be selector (no-cond)
                 [10,-1,-1,-1, 4,-1,-1,-1,-1,-1], //4. to-be selector (cond)
                 [11,-1,-1,-1, 5,-1,-1,-1,-1,11], //5. to-be selector (facing)
                 [-1,-1,-1,-1, 6,-1, 4, 5,-1,-1], //6. to-be cond'ed selector
                 [16,-1,16,-1, 7,-1,-1,-1,-1,16], //7. to-be rule (is)
                 [16,-1,-1,-1, 8,-1,-1,-1,-1,-1], //8. to-be rule (verb)
                 [-1,-1,-1,-1, 9, 2,-1,-1,-1,-1], //9. to-be prefix
                 [-1, 7,-1,12,-1,-1,-1,-1, 8,-1], //10. selector (cond)
                 [-1, 7,-1,13,-1,-1,-1,-1, 8,-1], //11. selector (facing)
                 [10,-1,-1,-1,12,-1, 4, 5,-1,-1], //12. and'ed selector (cond)
                 [11,-1,-1,-1,13,-1, 4, 5,-1,11], //13. and'ed selector (facing)
                 [16, 7,16,-1, 7,-1,-1,-1, 8,16], //14. and'ed rule (is)
                 [17, 7,-1,-1, 8,-1,-1,-1, 8,-1], //15. and'ed rule (verb)
                 [-2,-2,-2,14,-2,-2,-2,-2,-2,-2], //16. rule (is)
                 [-2,-2,-2,15,-2,-2,-2,-2,-2,-2]] //17. rule (verb)
                 
var rules = [];

function nextwordparse(currules,curtile,direc,statenow){ //direc=0 x-axis, direc=1 y-axis
    if(direc == 0){
        if(statenow >= 0){
            idaround = curtile.idaround();
            for(var i = 0; i < idaround.length; i ++){
                var id = idaround[i];
                var a = tiles[id];
                if(a.x == curtile.x + 24 & a.y >= curtile.y - 12 & a.y < curtile.y + 12){
                    if(a.name.startsWith("text_")){
                        currules.push(new ruletile(a.name.slice(5),a.texttype,id));
                        nextwordparse(currules,a,0,adjmatrix[statenow][a.texttype]);
                        currules.pop();
                    }
                }
            }
        }
    }else{
        if(statenow >= 0){
            idaround = curtile.idaround();
            for(var i = 0; i < idaround.length; i ++){
                var id = idaround[i];
                var a = tiles[id];
                if(a.y == curtile.y + 24 & a.x >= curtile.x - 12 & a.x < curtile.x + 12){
                    if(a.name.startsWith("text_")){
                        currules.push(new ruletile(a.name.slice(5),a.texttype,id));
                        nextwordparse(currules,a,1,adjmatrix[statenow][a.texttype]);
                        currules.pop();
                    }
                }
            }
        }
    }
    if(statenow == 16 || statenow == 17){
        var isasubset = false;
        for(var i = 0; i < rules.length; i ++){
            if(rules[i] == null){
                continue;
            }
            if(subsetcheck(currules,rules[i])){
                isasubset = true;
                break;
            }else if(subsetcheck(rules[i],currules)){
                rules[i] = null;
            }
        }
        if(!isasubset){
            rules.push(currules.slice(0));
            for(var i = 0; i < currules.length; i ++){
                tiles[currules[i].id].activated = true;
            }
        }
    }
}

function ruleparse(){
    rules = [];
    for(var i = 0; i < tiles.length; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        a.activated = false; //0=horizontal, 1=vertical
    }
    for(var i = 0; i < tiles.length; i ++){
        var a = tiles[i];
        if(a == null){
            continue;
        }
        if(a.name.startsWith("text_")){
            nextwordparse([new ruletile(a.name.slice(5),a.texttype,i)],a,0,adjmatrix[0][a.texttype]);
            nextwordparse([new ruletile(a.name.slice(5),a.texttype,i)],a,1,adjmatrix[0][a.texttype]);
        }
    }
    rules.push([new ruletile("text",0,-1),new ruletile("is",1,-1),new ruletile("push",2,-1)]);
}

function ruleinterpret(){
    windowrules = [];
    windowconverts = [];
    windowhasrules = [];
    notransforms = [];
    for(var i = 0; i < tiles.length; i ++){
        if(tiles[i] == null){
            continue;
        }
        tiles[i].rules = [];
        tiles[i].hasrules = [];
        tiles[i].converts = [];
        tiles[i].eatrules = [];
        tiles[i].followrules = [];
    }
    for(var i = 0; i < rules.length; i ++){
        r = rules[i];
        if(r == null){
            continue;
        }
        var verbpos = -1;
        for(var j = 0; j < r.length; j ++){
            if(r[j].texttype == 1 || r[j].texttype == 8){
                verbpos = j;
                break;
            }
        }
        var subject = r.slice(0,verbpos);
        var predicate = r.slice(verbpos);
        
        for(var j = 0; j < tiles.length; j ++){
            var a = tiles[j];
            if(a == null){
                continue;
            }
            var issubject = false;
            var subjectstate = 0; //1-prefix, 2-noun, 3-condition:on, 4-condition:near, 5-condition:facing
            for(var k = 0; k < subject.length; k ++){
                if(subject[k].texttype == 3){
                    continue;
                }
                if(subject[k].texttype == 5){
                    subjectstate = 1;
                }else if(subject[k].name == "on"){
                    subjectstate = 3;
                    continue;
                }else if(subject[k].name == "near"){
                    subjectstate = 4;
                    continue;
                }else if(subject[k].name == "facing"){
                    subjectstate = 5;
                    continue;
                }else if(subjectstate <= 1 & subject[k].texttype == 0){
                    subjectstate = 2;
                }
                
                if(subjectstate == 1){
                    if(subject[k].name == "lonely"){
                        if(a.idinside().length > 0){
                            issubject = false;
                            break;
                        }
                    }else if(subject[k].name == "idle"){
                        if(moveup != 0 || movedown != 0 || moveleft != 0 || moveright != 0 || moveup2 != 0 || movedown2 != 0 || moveleft2 != 0 || moveright2 != 0){
                            issubject = false;
                            break;
                        }
                    }
                }else if(subjectstate == 2){
                    if(subject[k].name == "all" & !a.name.startsWith("text_")){
                        issubject = true;
                    }else if(subject[k].name == "text" & a.name.startsWith("text_")){
                        issubject = true;
                    }else if(subject[k].name == a.name){
                        issubject = true;
                    }
                }else if(subjectstate == 3){
                    var idinside = a.idinside();
                    objinside = [];
                    for(var l = 0; l < idinside.length; l ++){
                        if(tiles[idinside[l]].name.startsWith("text_")){
                            objinside.push("text");
                        }else{
                            objinside.push(tiles[idinside[l]].name);
                        }
                    }
                    var allcheck = false;
                    if(subject[k].name == "all"){
                        for(var l = 0; l < objinside.length; l ++){
                            if(objinside[l] != "text"){
                                allcheck = true;
                            }
                        }
                    }
                    if(!(objinside.includes(subject[k].name) || allcheck)){
                        issubject = false;
                        break;
                    }
                }else if(subjectstate == 4){
                    var idaround = a.idaround();
                    objnear = [];
                    for(var l = 0; l < idaround.length; l ++){
                        var curtile = tiles[idaround[l]];
                        if(a.x > curtile.x-48 & a.x < curtile.x + 48 & a.y > curtile.y-48 & a.y < curtile.y + 48){
                            if(tiles[idaround[l]].name.startsWith("text_")){
                                objnear.push("text");
                            }else{
                                objnear.push(tiles[idaround[l]].name);
                            };
                        }
                    }
                    var allcheck = false;
                    if(subject[k].name == "all"){
                        for(var l = 0; l < objnear.length; l ++){
                            if(objnear[l] != "text"){
                                allcheck = true;
                            }
                        }
                    }
                    if(!(objnear.includes(subject[k].name) || allcheck)){
                        issubject = false;
                        break;
                    }
                }else if(subjectstate == 5){
                    if(subject[k].texttype == 0){
                        var idaround = a.idaround();
                        objfacing = [];
                        for(var l = 0; l < idaround.length; l ++){
                            var curtile = tiles[idaround[l]];
                            if(a.direction == 0 & curtile.x > a.x - 48 & curtile.x < a.x & curtile.y > a.y - 12 & curtile.y < a.y + 12){
                                if(tiles[idaround[l]].name.startsWith("text_")){
                                    objfacing.push("text");
                                }else{
                                    objfacing.push(tiles[idaround[l]].name);
                                }
                            }
                            else if(a.direction == 1 & curtile.x < a.x + 48 & curtile.x > a.x & curtile.y < a.y + 12 & curtile.y > a.y - 12){
                                if(tiles[idaround[l]].name.startsWith("text_")){
                                    objfacing.push("text");
                                }else{
                                    objfacing.push(tiles[idaround[l]].name);
                                }
                            }
                        }
                        var allcheck = false;
                        if(subject[k].name == "all"){
                            for(var l = 0; l < objfacing.length; l ++){
                                if(objfacing[l] != "text"){
                                    allcheck = true;
                                }
                            }
                        }
                        if(!(objfacing.includes(subject[k].name) || allcheck)){
                            issubject = false;
                            break;
                        }
                    }else if(subject[k].texttype == 9){
                        if(subject[k].name == "left" & a.direction == 1){
                            issubject = false;
                            break;
                        }else if(subject[k].name == "right" & a.direction == 0){
                            issubject = false;
                            break;
                        }
                    }
                }
            }
            
            //
            if(issubject){
                var curverb = ""; //"NOT" IS NOT IMPEMENETED YET!!!!
                for(var k = 0; k < predicate.length; k ++){
                    if(predicate[k].texttype == 3){
                        continue;
                    }
                    if(predicate[k].texttype == 1 || predicate[k].texttype == 8){
                        curverb = predicate[k].name;
                        continue;
                    }
                    if(curverb == "is"){
                        //NOUN IS NOUN (for notransforms only)
                        if(predicate[k].texttype == 0){
                            if(predicate[k].name == a.name){
                                a.rules.push("notransform");
                            }else if(predicate[k].name == "text"){
                                a.converts.push("text_" + a.name);
                            }else if(predicate[k].name == "all"){
                                for(i = 0; i < allobjects.length; i ++){
                                    a.converts.push(allobjects[i]);
                                }
                            }else{
                                a.converts.push(predicate[k].name);
                            }
                        }
                        //NOUN IS PROPERTY
                        else if(predicate[k].texttype == 2 || predicate[k].texttype == 9){
                            a.rules.push(predicate[k].name);
                        }
                    //HAS
                    }else if(curverb == "has"){
                        if(predicate[k].name == "text"){
                            if(a.name.startsWith("text_")){
                                a.hasrules.push("text_text");
                            }else{
                                a.hasrules.push("text_" + a.name);
                            }
                        }else if(predicate[k].name == "all"){
                            for(i = 0; i < allobjects.length; i ++){
                                a.hasrules.push(allobjects[i]);
                            }
                        }else{
                            a.hasrules.push(predicate[k].name);
                        }
                    //MAKE
                    }else if(curverb == "make"){
                        
                    //EAT
                    }else if(curverb == "eat"){
                        if(predicate[k].name == "all"){
                            for(i = 0; i < allobjects.length; i ++){
                                a.eatrules.push(allobjects[i]);
                            }
                        }else{
                            a.eatrules.push(predicate[k].name);
                        }
                        
                    //FEAR
                    }else if(curverb == "fear"){
                        
                    //FOLLOW
                    }else if(curverb == "follow"){
                        if(predicate[k].name == "all"){
                            for(i = 0; i < allobjects.length; i ++){
                                a.followrules.push(allobjects[i]);
                            }
                        }else{
                            a.followrules.push(predicate[k].name);
                        }
                    }
                }
            }
        }
        
        //special cases for window
        //check if object satisfies subject's conditions
        var subject = r.slice(0,verbpos);
        
        var issubject = false;
        for(var k = 0; k < subject.length; k ++){
            // (for now, no prefix/conditions yet)
            if(subject[k].name == "window"){
                issubject = true;
            }
        }
        //
        if(issubject){
            var predicate = r.slice(verbpos);
            
            var curverb = ""; //NOT IS NOT IMPEMENETED YET!!!!
            for(var k = 0; k < predicate.length; k ++){
                if(predicate[k].texttype == 3){
                    continue;
                }
                if(predicate[k].texttype == 1 || predicate[k].texttype == 8){
                    curverb = predicate[k].name;
                    continue;
                }
                if(curverb == "is"){
                    //NOUN IS NOUN
                    if(predicate[k].texttype == 0){
                        if(predicate[k].name == "window"){
                            windowrules.push("notransform");
                        }else if(predicate[k].name == "text"){
                            windowconverts.push("text_window");
                        }else if(predicate[k].name == "all"){
                            for(i = 0; i < allobjects.length; i ++){
                                windowconverts.push(allobjects[i]);
                            }
                        }else{
                            windowconverts.push(predicate[k].name);
                        }
                    }
                    //NOUN IS PROPERTY
                    else if(predicate[k].texttype == 2){
                        windowrules.push(predicate[k].name);
                    }
                //HAS
                }else if(curverb == "has"){
                    if(predicate[k].name == "text"){
                        windowhasrules.push("text_window");
                    }else if(predicate[k].name == "all"){
                        for(i = 0; i < allobjects.length; i ++){
                            windowhasrules.push(allobjects[i]);
                        }
                    }else{
                        windowhasrules.push(predicate[k].name);
                    }
                }
            }
        }
    }
}
