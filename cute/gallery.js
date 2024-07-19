//data is loaded in data.js
const searchbox = document.getElementById("searchbox")
const gallery = document.getElementById("gallery")
const w = 5; //table width

function includesall(str, query){
    for(x of query){
        if(!str.includes(x)) return false;
    }
    return true;
}

function showresults(){
    let query = searchbox.value.toLowerCase().split(" ");
    let images = [];
    for(img of data){
        if(includesall(img.tags, query)) images.push(img);
    }
    makegrid(images);
}

function makegrid(images){
    if(images.length == 0){
        gallery.innerHTML = "<td>No results...</td>"
    }else{
        let code = '<colgroup><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"><col style="width: 20%"></colgroup><tr>';
        let r = 0;
        for(img of images){
            if(r == w){ code += "</tr><tr>"; r = 0; }
            r ++;
            code += "<td>" +
                    "<a href='" + img.source + "'><img src='" + img.file + "' width=255></a><br/>" +
                    artistlink(img) + "<br/>" +
                    "</td>";
        }
        code += "</tr>";
        gallery.innerHTML = code;
    }
}

searchbox.addEventListener("input", showresults);
showresults();
