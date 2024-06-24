// Path: https://stackoverflow.com/questions/2161159/get-script-path
// Regex: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace

let scripts = document.getElementsByTagName('script');
let path = scripts[scripts.length-1].src;
let mydir = path.split('/').slice(0, -1).join('/')+'/';

let webpemojis = /:(akarinope|akariyep|bebelove|chokodestroy|hacker|heh|ikuwow|kanadecry|kanaderamen|koishibaka|matelove|menheranerdglasses|menherateehee|mikuexcited|nanaadmire|nanabday|nanableh|nanacry|nanakiss|nanasmirk|nanawave|nanaxd|neko|niko|pomihappy|pominervous|serikalong|tere|vodkahug|zoneadmire|zonelmao|zonepeek):/g
let gifemojis = /:(bocchihide|nanaaaa|nanaclap|nanayay):/g

document.body.innerHTML = document.body.innerHTML.replace(webpemojis, '<img src="' + mydir + '$1.webp" height="24" />');
document.body.innerHTML = document.body.innerHTML.replace(gifemojis, '<img src="' + mydir + '$1.gif" height="24" />');
document.body.innerHTML = document.body.innerHTML.replace(/:(\w+):/g, '<span style="font-weight: bold; background-color: red; color: white">[ERROR! EMOJI $1 IS NOT IN THE LIST]</span>');
